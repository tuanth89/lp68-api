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
const moment = require('moment');
const StringService = require('../../services/stringService');

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

function newContractLuuThongListener(luuthongs) {
    let luuthongList = [];

    luuthongs.forEach((luuthongItem) => {
        let nextPayDate = new Date(luuthongItem.createdAt);
        nextPayDate.setDate(nextPayDate.getDate() + 1);

        let totalMoneyPaid = luuthongItem._doc.totalMoneyPaid || 0;
        let dailyMoneyPay = luuthongItem._doc.dailyMoneyPay || 0;
        let luuthong = new HdLuuThong();
        luuthong.contractId = luuthongItem.contractId;
        luuthong.creator = luuthongItem.creator;

        if (totalMoneyPaid > 0) {
            luuthong.moneyHavePay = luuthongItem.moneyHavePay;
            luuthong.moneyPaid = luuthongItem.moneyPaid;
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

function updateAndNewLuuThong(hdLuuThongId, contractNew, contractOldId) {
    let luuthongList = [];
    let updateLuuThong = {
        status: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
        updatedAt: new Date()
    };

    let nextPayDate = new Date(contractNew.createdAt);
    nextPayDate.setDate(nextPayDate.getDate() + 1);

    let luuthong = new HdLuuThong();
    luuthong.contractId = contractNew._id;
    luuthong.creator = contractNew.creator;
    luuthong.moneyHavePay = contractNew.dailyMoney;
    luuthong.moneyPaid = contractNew.dailyMoney;
    luuthong.createdAt = nextPayDate;

    luuthongList.push(luuthong);

    if (contractNew.isDaoHd) {
        let luuThongDaoCurrent = new HdLuuThong();
        luuThongDaoCurrent.contractId = contractNew._id;
        luuThongDaoCurrent.creator = contractNew.creator;
        luuThongDaoCurrent.createdAt = contractNew.createdAt;
        luuThongDaoCurrent.moneyHavePay = contractNew.dailyMoney;
        luuThongDaoCurrent.moneyPaid = contractNew.moneyPayNew === undefined ? 0 : contractNew.moneyPayNew;
        luuThongDaoCurrent.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;
        luuthongList.push(luuThongDaoCurrent);

        // Update tổng tiền đã dóng vào hợp đồng
        ContractRepository.updateTotalMoneyPaid(contractNew._id, luuThongDaoCurrent.moneyPaid);

        // Khi đáo sẽ ko mặc định trừ tiền đóng ngày hôm đó của HĐ cũ mà dựa vào số tiền nhân viên nhập
        updateLuuThong.moneyPaid = contractNew.moneyPayOld === undefined ? 0 : contractNew.moneyPayOld;
    }

    HdLuuThong.update({_id: hdLuuThongId}, {
        $set: updateLuuThong
    })
        .then(() => {

        });

    HdLuuThong.update({_id: hdLuuThongId}, {
        $set: updateLuuThong
    })
        .then(() => {

        });


    HdLuuThong.update({
            _id: {$ne: hdLuuThongId},
            contractId: contractOldId,
            status: CONTRACT_OTHER_CONST.STATUS.NORMAL
        },
        {
            $set: {
                status: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
                moneyPaid: 0,
                moneyHavePay: 0,
                updatedAt: new Date()
            }
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

function insertOrUpdateBulkContractLog(data) {
    ContractLogRepository.findByContractId(data.contractId)
        .then((contractLog) => {
            let contractLogs = [];
            let contractLogItem = {
                histories: contractLog ? contractLog.histories : [],
                contractId: data.contractId,
                customerId: data.customerId,
                createdAt: data.createdAt
            };
            if (data.moneyPayOld > 0) {
                let history = {};
                let moneyPaidOld = data.moneyPayOld !== undefined ? StringService.formatNumeric(parseInt(data.moneyPayOld)) : 0;
                history.title = "Đóng " + moneyPaidOld;
                history.start = new Date(moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss.000").toString() + 'Z');
                history.stick = true;
                contractLogItem.histories.push(history);

                let historyDaoHan = {};
                historyDaoHan.title = "Đáo hạn";
                historyDaoHan.start = new Date(history.start);
                historyDaoHan.stick = true;
                contractLogItem.histories.push(historyDaoHan);

                contractLogs.push(contractLogItem);
            }

            if (data.moneyPayNew > 0) {
                let contractNewLogItem = Object.assign({}, contractLogItem);
                contractNewLogItem.contractId = data.contractNewId;
                contractNewLogItem.histories = [];
                contractNewLogItem.createdAt = moment().format("YYYY-MM-DD");
                let moneyPaid = data.moneyPayNew !== undefined ? StringService.formatNumeric(parseInt(data.moneyPayNew)) : 0;
                let historyNew = {};
                historyNew.title = "Đóng " + moneyPaid;
                historyNew.start = new Date(moment().format("YYYY-MM-DD HH:mm:ss.000").toString() + 'Z');
                historyNew.stick = true;
                contractNewLogItem.histories.push(historyNew);
                contractLogs.push(contractNewLogItem);
            }

            if (contractLogs.length > 0) {
                ContractLogRepository.insertOrUpdateBulkContractLog(contractLogs)
                    .catch((error) => {
                        log.error(error);
                    })
                    .done();
            }
        })
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
