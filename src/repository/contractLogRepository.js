"use strict";

const ContractLog = require('../models/contractLog');
const Q = require("q");
const errors = require('restify-errors');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const StringService = require('../services/stringService');
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');

/**
 *
 * @param contractId
 * @returns {*|promise}
 */
function findByContractId(contractId) {
    const deferred = Q.defer();

    // if (ObjectId.isValid(id)) {
    if (StringService.isObjectId(contractId)) {
        contractId = new ObjectId(contractId);
    }

    ContractLog
        .findOne({
            contractId: ObjectId(contractId)
        })
        // .select(Serializer.detail)
        .exec(function (err, contract) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(contract);
            }
        });

    return deferred.promise;
}

/**
 *
 * @param contractId
 * @returns {*|promise}
 */
function findAllByContractId(contractId) {
    const deferred = Q.defer();

    let query = [
        {
            $match: {contractId: ObjectId(contractId)}
        },
        {
            $lookup: {
                from: "contracts",
                localField: "contractId",
                foreignField: "_id",
                as: "contracts"
            }
        }
        , {
            $project: {
                _id: 1,
                contract: {"$arrayElemAt": ["$contracts", 0]},
                histories: 1
            }
        }
        , {
            $project: {
                _id: 1,
                histories: 1,
                createdAt: "$contract.createdAt",
                loanMoney: "$contract.loanMoney",
                actuallyCollectedMoney: "$contract.actuallyCollectedMoney",
                totalMoneyPaid: "$contract.totalMoneyPaid"
            }
        }
    ];

    ContractLog
        .aggregate(query)
        .exec(function (err, contract) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(contract.length > 0 ? contract[0] : null);
            }
        });

    return deferred.promise;
}

/**
 *
 * @param contractId
 * @param history
 * @returns {*}
 */
function addHistory(contractId, history) {
    const deferred = Q.defer();

    if (!history._id)
        history._id = new ObjectId();

    ContractLog.update({contractId: contractId}, {$push: {histories: history}}, function (error, history) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(history);
        }
    });

    return deferred.promise;
}

/**
 *
 * @param contractId
 * @param histories
 * @returns {*}
 */
function addHistories(contractId, histories) {
    const deferred = Q.defer();

    if (!history._id)
        history._id = new ObjectId();

    ContractLog.update(
        {
            contractId: contractId
        },
        {
            $push: {histories: {$each: histories}}
        }
        , function (error, contract) {
            if (error) {
                deferred.reject(new errors.InvalidContentError(error.message));
            } else {
                deferred.resolve(contract);
            }
        });

    return deferred.promise;
}

function bulkHistoriesByContractId(contracts) {
    const deferred = Q.defer();
    let bulk = ContractLog.collection.initializeOrderedBulkOp();

    _.each(contracts, function (contract) {
        let histories = [];

        let moneyPaid = contract.moneyPaid !== undefined ? StringService.formatNumeric(contract.moneyPaid) : 0;
        if (moneyPaid > 0) {
            let history = {};

            history.title = "Đóng " + moneyPaid;
            history.start = contract.createdAt;
            history.stick = true;
            histories.push(history);
        }

        if (contract.newPayMoney > 0) {
            let historyOther = {};
            historyOther.title = "Đóng " + StringService.formatNumeric(contract.newPayMoney);
            historyOther.start = contract.createdAt;
            historyOther.stick = true;
            histories.push(historyOther);
        }

        if (histories.length > 0)
            bulk.find({contractId: ObjectId(contract.contractId)})
                .update({$push: {histories: {$each: histories}}});
    });

    if (bulk && bulk.s && bulk.s.currentBatch
        && bulk.s.currentBatch.operations
        && bulk.s.currentBatch.operations.length > 0) {
        bulk.execute(function (error, results) {
            if (error) {
                deferred.reject(false);
            } else {
                deferred.resolve(true);
            }
        });
    } else
        deferred.resolve(true);

    return deferred.promise;
}

/**
 *
 * @param data
 * @returns {*|promise}
 */
function insertMany(data) {
    const deferred = Q.defer();

    let contractLogList = [];

    data.forEach((contractItem) => {

        let contractLog = new ContractLog();
        if (parseInt(contractItem.paidMoney) > 0) {
            let history = {};
            if (contractItem.isDaoHan) {
                history.title = "Đáo hạn";
            } else {

                let moneyPaid = contractItem.paidMoney !== undefined ? StringService.formatNumeric(parseInt(contractItem.paidMoney)) : 0;
                history.title = "Đóng " + moneyPaid;
                // else {
                //     let moneyPaid = contractItem.dailyMoneyPay !== undefined ? StringService.formatNumeric(parseInt(contractItem.dailyMoneyPay)) : 0;
                //     history.title = "Đóng " + moneyPaid;
                // }
            }

            history.start = moment(contractItem.createdAt).format("YYYY-MM-DD HH:mm:ss.000").toString() + 'Z';
            history.stick = true;

            contractLog.histories = [];
            contractLog.histories.push(history);
        }

        contractLog.contractId = contractItem.contractId;
        contractLog.creator = contractItem.creator;
        contractLog.customerId = contractItem.customerId;

        contractLog.createdAt = moment().format("YYYY-MM-DD");

        contractLogList.push(contractLog);

    });

    if (contractLogList.length > 0) {
        ContractLog.insertMany(contractLogList, function (error, item) {
            if (error) {
                console.log(error);
                deferred.reject(
                    new errors.InvalidContentError(error.message)
                );
            } else {
                deferred.resolve(contractLogList);
            }
        });
    } else {
        deferred.resolve(contractLogList);
    }

    return deferred.promise;
}

function insertOrUpdateBulkContractLog(contracts) {
    const deferred = Q.defer();

    let bulk = ContractLog.collection.initializeOrderedBulkOp();
    _.each(contracts, function (contractItem) {
        bulk.find({contractId: contractItem.contractId})
            .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(contractItem);
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
}

/**
 *
 * @param id
 * @returns {*|promise}
 */
function remove(id) {
    const deferred = Q.defer();

    ContractLog.remove({
        _id: id
    }, function (error) {
        if (error) {
            console.log(error);
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
}

module.exports = {
    findByContractId: findByContractId,
    findAllByContractId: findAllByContractId,
    insertMany: insertMany,
    addHistory: addHistory,
    addHistories: addHistories,
    bulkHistoriesByContractId: bulkHistoriesByContractId,
    insertOrUpdateBulkContractLog: insertOrUpdateBulkContractLog,
    remove: remove

};