"use strict";

const ContractLog = require('../../models/contractLog');
const HdLuuThong = require('../../models/hdLuuThong');
const Contract = require('../../models/contract');
const ContractRepository = require('../../repository/contractRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;
const moment = require('moment');
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');
const ObjectId = require('mongoose').Types.ObjectId;
const StringService = require('../../services/stringService');

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
        // if (data.luuthongMoneyPaid) {
        updateSet.moneyPaid = data.luuthongMoneyPaid;
        // }

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
                    let bulk = ContractLog.collection.initializeOrderedBulkOp();
                    let totalMoneyPaid = contractItem.totalMoneyPaid + (data.newPayMoney === undefined ? 0 : data.newPayMoney);

                    //region Sinh các bản ghi ngày theo số tiền đã nộp
                    let dayByMoney = Math.trunc(data.newPayMoney / (contractItem.dailyMoneyPay === 0 ? data.newPayMoney : contractItem.dailyMoneyPay));
                    let day = 1;

                    let luuThong = new HdLuuThong();
                    let luuThongList = [];

                    if (luuThongItem.status !== CONTRACT_OTHER_CONST.STATUS.COMPLETED) {
                        let updateLt = {
                            status: CONTRACT_OTHER_CONST.STATUS.COMPLETED
                        };
                        if (luuThongItem._id.toString() !== data.luuThongId.toString())
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
                        luuThongPaid.creator = contractItem.creator;
                        luuThongPaid.createdAt = dateCurrent.format("YYYY-MM-DD");

                        luuThongList.push(luuThongPaid);
                        day++;

                        let history = {
                            title: "Đã đóng",
                            start: dateCurrent.format("YYYY-MM-DD HH:mm:ss.000").toString() + 'Z',
                            stick: true
                        };

                        bulk.find({contractId: ObjectId(data.contractId)})
                            .update({$push: {histories: history}});
                    }

                    // Nếu chưa đóng đủ tiền thì sinh thêm bản ghi cho ngày tiếp theo
                    if (totalMoneyPaid < contractItem.actuallyCollectedMoney) {
                        let dateCurrent = moment(luuThongItem.createdAt);
                        dateCurrent.add(dayByMoney + 1, "days");

                        let luuThongNext = new HdLuuThong();
                        luuThongNext.moneyHavePay = contractItem.dailyMoneyPay;
                        luuThongNext.moneyPaid = 0;
                        luuThongNext.contractId = data.contractId;
                        luuThongNext.creator = contractItem.creator;
                        luuThongNext.createdAt = dateCurrent.format("YYYY-MM-DD");

                        luuThongList.push(luuThongNext);
                    }

                    HdLuuThong.insertMany(luuThongList, function (error, item) {
                        if (error) {
                            console.log(error);
                        }
                    });
                    //endregion

                    //region Cập nhật tổng tiền đã nộp vào hợp đồng, Cập nhật tiền nộp khách ngày hôm đó

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


                    //region Ghi log đã đóng tiền theo ngày cho hợp đồng

                    bulk.execute(function (error, results) {
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

/**
 * @desc Sửa tiền đóng theo ngày lưu thông và cập nhật lại tổng tiền, log
 * @param {Object} data
 * @returns {*|promise}
 */
function editMoneyPaidPerDay(data) {
    // /* Sửa lại log theo ngày đã đóng cho hợp đồng */
    // let contractLog = [{
    //     contractId: contractId,
    //     moneyPaid: newPayMoney,
    //     createdAt: moment(data.payDate, "DD/MM/YYYY").format("YYYY-MM-DD")
    // }];
    // EventDispatcher.addMultiLogToContractLogListener(contractLog);

    HdLuuThong.findOneAndUpdate(
        {
            _id: data.luuThongId
        }, {
            $set: {
                moneyPaid: data.moneyPaidNew
            }
        }, function (error, item) {
            if (error) {
                console.log(error);
            }
        });

    Contract.findOneAndUpdate(
        {
            _id: data.contractId
        },
        {
            $set: {
                totalMoneyPaid: data.totalMoneyPaid
            }
        }, function (error, item) {
            if (error) {
                console.log(error);
            }
        });


    let dateFilter = new Date(data.createdAt);

    let dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate(), 0, 0, 0);
    let dateTo = dateFilter.addDays(1);
    dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0);

    let moneyPaid = data.moneyPaidNew > 0 ? ("Đóng " + StringService.formatNumeric(data.moneyPaidNew)) : "Nợ";
    ContractLog.updateOne({
            contractId: ObjectId(data.contractId),
            "histories.start": {$gte: dateFrom, $lt: dateTo}
        },
        {$set: {"histories.$.title": moneyPaid}},
        function (error, item) {
            if (error) {
                console.log(error);
            }
        }
    );

}

module.exports = {
    updateStatusLuuThongContract: updateStatusLuuThongContract,
    updateContractTotalMoneyPaid: updateContractTotalMoneyPaid,
    updateContractDongTruoc: updateContractDongTruoc,
    editMoneyPaidPerDay: editMoneyPaidPerDay
};
