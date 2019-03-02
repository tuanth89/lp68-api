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
                actuallyCollectedMoney: "$contract.actuallyCollectedMoney"
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
        let history = {};
        let moneyPaid = contract.moneyPaid !== undefined ? StringService.formatNumeric(contract.moneyPaid) : 0;
        history.title = "Đóng " + moneyPaid;
        history.start = contract.createdAt;
        history.stick = true;

        bulk.find({contractId: ObjectId(contract.contractId)})
            .update({$push: {histories: history}});
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contracts);
        }
    });

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
        let history = {};
        if (contractItem.isDaoHan) {
            history.title = "Đáo hạn";
        }
        else {
            let moneyPaid = contractItem.dailyMoneyPay !== undefined ? StringService.formatNumeric(parseInt(contractItem.dailyMoneyPay)) : 0;
            history.title = "Đóng " + moneyPaid;
        }

        history.start = moment(contractItem.createdAt).format("YYYY-MM-DD HH:mm:ss.000").toString()+'Z';
        history.stick = true;

        contractLog.histories = [];
        contractLog.histories.push(history);

        contractLog.contractId = contractItem.contractId;
        contractLog.customerId = contractItem.customerId;
        contractLog.createdAt = new Date();
        contractLogList.push(contractLog);
    });

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

    return deferred.promise;
}

function insertOrUpdateBulkContractLog(contracts) {
    const deferred = Q.defer();

    let bulk = ContractLog.collection.initializeOrderedBulkOp();
    _.each(contracts, function (contractItem) {
        let contractLog = new ContractLog();
        let history = {};
        if (contractItem.isDaoHan) {
            history.title = "Đáo hạn";
        }
        else {
            let moneyPaid = contractItem.dailyMoneyPay !== undefined ? StringService.formatNumeric(parseInt(contractItem.dailyMoneyPay)) : 0;
            history.title = "Đóng " + moneyPaid;
        }

        history.start = moment(contractItem.createdAt).format("YYYY-MM-DD HH:mm:ss.000").toString()+'Z';
        history.stick = true;

        contractLog.histories = [];
        contractLog.histories.push(history);

        contractLog.contractId = contractItem.contractId;
        contractLog.customerId = contractItem.customerId;
        contractLog.createdAt = new Date();

        bulk.find({contractId: ObjectId(contractLog.contractId)})
            .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(contractLog);
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contracts);
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