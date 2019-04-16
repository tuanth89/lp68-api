"use strict";

const HdLuuThong = require('../../models/hdLuuThong');
const Contract = require('../../models/contract');
const ContractRepository = require('../../repository/contractRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;
const moment = require('moment');
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * @desc update trạng thái hợp đồng, hợp đồng lưu thông
 * @param {Object} data
 * @returns {*|promise}
 */
function updateStatusLuuThongContract(data) {
    if (data.contractId) {
        if (data.totalMoneyPaid > 0) {
            ContractRepository.updateTotalMoneyPaid(data.contractId, data.totalMoneyPaid)
                .catch((error) => {
                    log.error(error);
                })
                .done();
        }

        if (data.contractStatus > 0) {
            ContractRepository.updateStatusTransferDate(data.contractId, data)
                .catch((error) => {
                    log.error(error);
                })
                .done();
        }
    }

    if (data.luuThongId) {
        let updateSet = {
            status: data.luuThongStatus
        };
        if (data.luuthongMoneyPaid) {
            updateSet.moneyPaid = data.luuthongMoneyPaid;
        }

        HdLuuThong.findOneAndUpdate(
            {
                _id: data.luuThongId
            }, {
                $set: updateSet
            }, function (error, item) {
                if (error) {
                    console.log(error);
                }
            });

        // Trường hợp lãi đứng: chưa nộp hết tiền thì vẫn sinh lưu thông đóng lãi hàng ngày
        if (data.isLaiDung && data.contractStatus === -1) {
            HdLuuThongRepository.insertHdLuuThong(data.contractId, data.dataLuuThong);
        }

    }
}

/**
 * @desc update tổng tiền đã đóng của hợp đồng
 * @param {Object} data
 * @returns {*|promise}
 */
function updateContractTotalMoneyPaid(data) {
    ContractRepository.findById(data.contractId)
        .then(contractItem => {
            let totalMoneyPaid = contractItem.totalMoneyPaid + (data.payMoneyOriginal === undefined ? 0 : data.payMoneyOriginal);
            let updateSet = {
                totalMoneyPaid: totalMoneyPaid
            };
            if (data.newTransferDate) {
                updateSet.transferDate = moment(data.newTransferDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            }

            if (data.appointmentDate) {
                updateSet.appointmentDate = moment(data.appointmentDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            }

            // ContractRepository.updateTotalMoneyPaid(data.contractId, totalMoneyPaid);
            Contract.update({
                _id: data.contractId
            }, {
                $set: updateSet
            }, {upsert: true}, function (error, contract) {
                if (error) {
                    log.error(error);
                }
            });
        })
        .catch((error) => {
            log.error(error);
        })
        .done();
}

/**
 * @desc Cập nhật tiền đóng, cộng thêm ngày khi đóng trước
 * @param {Object} data
 * @returns {*|promise}
 */
function updateContractDongTruoc(data) {
    ContractRepository.findById(data.contractId)
        .then(contractItem => {
            HdLuuThongRepository.findDateDescByContractId(data.contractId)
                .then(luuThongItem => {
                    //region Sinh các bản ghi ngày theo số tiền đã nộp
                    let dayByMoney = Math.trunc(data.newPayMoney / (contractItem.dailyMoneyPay === 0 ? data.newPayMoney : contractItem.dailyMoneyPay));
                    let day = 1;

                    let luuThong = new HdLuuThong();
                    let luuThongList = [];

                    if (luuThongItem.status !== CONTRACT_OTHER_CONST.STATUS.COMPLETED) {
                        let updateLt = {
                            status: CONTRACT_OTHER_CONST.STATUS.COMPLETED
                        };
                        if(luuThongItem._id.toString() !== data.luuThongId.toString())
                            updateLt.moneyPaid = 0;

                        HdLuuThong.findOneAndUpdate({_id: luuThongItem._id}, {
                            $set: updateLt
                        }, function (error, item) {
                            if (error) {
                                console.log(error);
                            }
                        });
                        dayByMoney--;
                    }

                    while (day <= dayByMoney) {
                        let dateCurrent = moment(luuThongItem.createdAt);
                        dateCurrent.add(day, "days");

                        let luuThongPaid = Object.assign({}, luuThong);
                        luuThongPaid = new HdLuuThong();
                        luuThongPaid.moneyHavePay = 0;
                        luuThongPaid.moneyPaid = 0;
                        luuThongPaid.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;
                        luuThongPaid.contractId = data.contractId;
                        luuThongPaid.createdAt = dateCurrent.format("YYYY-MM-DD");

                        luuThongList.push(luuThongPaid);
                        day++;
                    }

                    HdLuuThong.insertMany(luuThongList, function (error, item) {
                        if (error) {
                            console.log(error);
                        }
                    });
                    //endregion

                    //region Cập nhật tổng tiền đã nộp vào hợp đồng, Cập nhật tiền nộp khách ngày hôm đó
                    let totalMoneyPaid = contractItem.totalMoneyPaid + (data.newPayMoney === undefined ? 0 : data.newPayMoney);
                    let updateSet = {
                        totalMoneyPaid: totalMoneyPaid
                    };

                    Contract.update({
                        _id: data.contractId
                    }, {
                        $set: updateSet
                    }, {upsert: true}, function (error, contract) {
                        if (error) {
                            log.error(error);
                        }
                    });

                    let updateLuuThongSet = {
                        status: CONTRACT_OTHER_CONST.STATUS.COMPLETED
                    };
                    if (data.luuthongMoneyPaid) {
                        updateLuuThongSet.moneyPaid = data.luuthongMoneyPaid;
                    }

                    HdLuuThong.findOneAndUpdate({_id: data.luuThongId}, {
                        $set: updateLuuThongSet
                    }, function (error, item) {
                        if (error) {
                            console.log(error);
                        }
                    });

                    //endregion

                });

        })
        .catch((error) => {
            log.error(error);
        })
        .done();
}


module.exports = {
    updateStatusLuuThongContract: updateStatusLuuThongContract,
    updateContractTotalMoneyPaid: updateContractTotalMoneyPaid,
    updateContractDongTruoc: updateContractDongTruoc
};