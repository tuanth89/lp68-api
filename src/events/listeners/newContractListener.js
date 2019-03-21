"use strict";

const Contract = require('../../models/contract');
const HdLuuThong = require('../../models/hdLuuThong');
const ContractLogRepository = require('../../repository/contractLogRepository');
const ContractRepository = require('../../repository/contractRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const PheConfigRepository = require('../../repository/pheConfigRepository');
const log = require('../../../logger').log;
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');
const CONTRACT_CONST = require('../../constant/contractConstant');
const _ = require('lodash');

function createContractLog(contracts) {
    ContractLogRepository.insertMany(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}
function addMultiLogToContractLog(contracts) {
    ContractLogRepository.bulkHistoriesByContractId(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function newContractAddedListener(contracts) {
    HdLuuThongRepository.insertMany(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function checkContractNo(contracts) {
    let itemContract = contracts[0];
    ContractRepository.generateContract(itemContract.storeCode, itemContract.customerCode)
        .then((count) => {
            contracts.forEach((contractItem) => {
                count++;

                // Mã cửa hàng/mã nv/số ngày vay/XM(XĐ)/STT
                let contractNo = `${contractItem.storeCode}/${contractItem.customerCode}/${contractItem.loanDate}/${contractItem.typeCode}/${count}`;

                Contract.update({_id: contractItem._id}, {
                    $set: {
                        noIdentity: count,
                        contractNo: contractNo
                    }
                }, function (error, contract) {
                    if (error) {
                        log.error(error);
                    }
                });


                // hđ lãi đứng: sinh phế cho nhân viên theo ngày phát sinh hđ
                if (contractItem.status === CONTRACT_CONST.STAND) {
                    PheConfigRepository.findByDayAndLoanMoney(contractItem.loanDate, contractItem.loanMoney, contractItem.isCustomerNew)
                        .then(item => {
                            if (item) {
                                Contract.update({_id: contractItem._id}, {
                                    $set: {
                                        commissionFee: {
                                            _id: item._id,
                                            day: item.day,
                                            loanMoneyPack: item.loanMoneyPack,
                                            receive: item.receive
                                        }
                                    }
                                }, {upsert: true}, function (error, contract) {
                                    if (error) {
                                        log.error(error);
                                    }
                                });
                            }
                        });
                }
            });
        });
}

function newContractOldAddedListener(contracts) {
    HdLuuThongRepository.insertManyByContractOld(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function newContractLuuThongListener(contracts) {
    let luuthongList = [];

    contracts.forEach((contractItem) => {
        let nextPayDate = new Date(contractItem.createdAt);
        nextPayDate.setDate(nextPayDate.getDate() + 1);

        let totalMoneyPaid = contractItem._doc.totalMoneyPaid || 0;
        let dailyMoneyPay = contractItem._doc.dailyMoneyPay || 0;
        let luuthong = new HdLuuThong();
        luuthong.contractId = contractItem.contractId;

        if (totalMoneyPaid > 0) {
            luuthong.moneyHavePay = contractItem.moneyHavePay;
            luuthong.moneyPaid = contractItem.moneyPaid;
        } else {
            luuthong.moneyHavePay = dailyMoneyPay;
            luuthong.moneyPaid = dailyMoneyPay;
        }

        luuthong.createdAt = nextPayDate;
        luuthongList.push(luuthong);
    });

    HdLuuThong.insertMany(luuthongList, function (error, item) {
        if (error) {
            log.error(error);
        } else {

        }
    });
}

function updateAndNewLuuThong(hdLuuThongId, contractNew) {
    let luuthongList = [];
    let updateLuuThong = {
        status: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
        updatedAt: new Date()
    };

    let nextPayDate = new Date(contractNew.createdAt);
    nextPayDate.setDate(nextPayDate.getDate() + 1);

    let luuthong = new HdLuuThong();
    luuthong.contractId = contractNew._id;
    luuthong.moneyHavePay = contractNew.dailyMoney;
    luuthong.moneyPaid = contractNew.dailyMoney;
    luuthong.createdAt = nextPayDate;

    luuthongList.push(luuthong);

    if (contractNew.isDaoHd) {
        let luuThongDaoCurrent = new HdLuuThong();
        luuThongDaoCurrent.contractId = contractNew._id;
        luuThongDaoCurrent.createdAt = contractNew.createdAt;
        luuThongDaoCurrent.moneyHavePay = contractNew.dailyMoney;
        luuThongDaoCurrent.moneyPaid = contractNew.dailyMoney;
        luuThongDaoCurrent.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;
        luuthongList.push(luuThongDaoCurrent);

        // Update tổng tiền đã dóng vào hợp đồng
        ContractRepository.updateTotalMoneyPaid(contractNew._id, luuThongDaoCurrent.moneyPaid);

        // Khi đáo sẽ ko mặc định trừ tiền đóng ngày hôm đó của HĐ cũ
        // HĐ đáo tự động trừ tiền đóng ngày hôm đó
        updateLuuThong.moneyPaid = 0;
    }

    HdLuuThong.update({_id: hdLuuThongId}, {
        $set: updateLuuThong
    })
        .then(() => {

        });

    HdLuuThongRepository.saveMany(luuthongList)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function removeAllByContract(contractId) {
    HdLuuThongRepository.removeByContractId(contractId)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function insertOrUpdateBulkContractLog(contracts) {
    ContractLogRepository.insertOrUpdateBulkContractLog(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function updatePheForStaff(contractId) {
    ContractRepository.findById(contractId)
        .then(contractItem => {
            PheConfigRepository.findByDayAndLoanMoney(contractItem.loanDate, contractItem.loanMoney, contractItem.isCustomerNew)
                .then(item => {
                    if (item) {
                        Contract.update({_id: contractId}, {
                            $set: {
                                commissionFee: {
                                    _id: item._id,
                                    day: item.day,
                                    loanMoneyPack: item.loanMoneyPack,
                                    receive: item.receive
                                }
                            }
                        }, {upsert: true}, function (error, contract) {
                            if (error) {
                                log.error(error);
                            }
                        });
                    }
                });
        })
}

module.exports = {
    createContractLog: createContractLog,
    addMultiLogToContractLog: addMultiLogToContractLog,
    newContractAddedListener: newContractAddedListener,
    newContractOldAddedListener: newContractOldAddedListener,
    newContractLuuThongListener: newContractLuuThongListener,
    updateAndNewLuuThong: updateAndNewLuuThong,
    removeAllByContract: removeAllByContract,
    insertOrUpdateBulkContractLog: insertOrUpdateBulkContractLog,
    checkContractNo: checkContractNo,
    updatePheForStaff: updatePheForStaff
};