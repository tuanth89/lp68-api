"use strict";

const Contract = require('../models/contract');
const Q = require("q");
const errors = require('restify-errors');
const HashService = require('../services/hashService');
const Serializer = require('../serializers/user');
const uuid = require('uuid');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const StringService = require('../services/stringService');
const CONTRACT_CONST = require('../constant/contractConstant');

/**
 *
 * @param id
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();

    // if (ObjectId.isValid(id)) {
    if (StringService.isObjectId(id)) {
        id = new ObjectId(id);
    }

    Contract
        .findOne({
            _id: id
        })
        // .select(Serializer.detail)
        .exec(function (err, user) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else if (!user) {
                deferred.reject(new errors.ResourceNotFoundError('The resource you requested could not be found.'));
            } else {
                deferred.resolve(user);
            }
        });

    return deferred.promise;
}

/**
 *
 * @param params
 * @returns {*|promise}
 */
function getList(params) {
    const deferred = Q.defer();

    Contract
        .apiQuery(params)
        // .select(Serializer.summary)
        .exec(function (error, users) {
            if (error) {
                console.error(error);
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(users);
            }
        });

    return deferred.promise;
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};
/**
 *
 * @param date
 * @param type
 * @returns {*|promise}
 */
function getListByDate(date, type) {
    const deferred = Q.defer();
    let dateFilter = new Date(date);
    let dateFrom = "";
    let dateTo = "";

    let query = {};
    switch (parseInt(type)) {
        case CONTRACT_CONST.NEW: // Khách mới
            dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate());
            dateTo = dateFilter.addDays(1);
            dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());

            query = {createdAt: {$gte: dateFrom, $lt: dateTo}};
            break;
        default: // Lưu thông
            dateFilter.addDays(1);
            query = {createdAt: {$lt: dateFilter}};
            break;
    }

    Contract
        .find(query)
        // .select(Serializer.summary)
        .exec(function (error, contracts) {
            if (error) {
                console.error(error);
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
 * @param data
 * @returns {*|promise}
 */
function update(id, data) {
    const deferred = Q.defer();

    Contract.findOneAndUpdate({
        _id: id
    }, data, {
        new: true
    }, function (error, user) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(user);
        }
    });


    return deferred.promise;
}

/**
 * Cập nhật số lượng lơn dữ liệu.
 * @param {Array} contracts
 */
function updateBulk(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeUnorderedBulkOp();

    Contract.findOne({$query: {}, $orderby: {noIdentity: -1}})
        .exec(function (error, item) {
            if (error) {
                deferred.reject(new errors.InvalidContentError(error.message));
            } else {
                let count = 0;
                if (item) {
                    count = item.noIdentity || 0;
                }

                _.each(contracts, function (contract) {
                    if (!contract._id) {
                        contract._id = new ObjectId();
                        contract.createdAt = new Date(contract.createdAt);
                    }
                    else {
                        contract.createdAt = new Date(contract.createdAt);
                        contract._id = ObjectId(contract._id);
                        contract.updatedAt = new Date();
                    }

                    if (!contract.contractNo) {
                        contract.noIdentity = ++count;
                        let nowDate = new Date();
                        contract.contractNo = `${nowDate.getFullYear()}_${contract.noIdentity}`;
                    }

                    if (contract.loanDate) {
                        let startDate = new Date(contract.createdAt);
                        contract.loanEndDate = new Date(startDate.setDate(startDate.getDate() + contract.loanDate));
                    }

                    if (contract.loanDate > 0) {
                        let dailyMoney = contract.actuallyCollectedMoney / contract.loanDate;
                        // contract.dailyMoney = Math.round(dailyMoney * 100) / 100;
                        contract.dailyMoney = dailyMoney.toFixed();
                    }

                    let item = new Contract(contract);

                    bulk.find({_id: ObjectId(item._id)})
                        .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
                        .updateOne(item);
                });

                bulk.execute(function (error, results) {
                    if (error) {
                        deferred.reject(new errors.InvalidContentError(error.message));
                    } else {
                        deferred.resolve(contracts);
                    }
                });
            }
        });

    return deferred.promise;
}

/**
 *
 * @param data
 * @returns {*|promise}
 */
function save(data) {
    const deferred = Q.defer();

    let contract = new Contract(data);

    contract.save(function (error, user) {
        if (error) {
            console.error(error);

            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;

            // deferred.reject(new errors.InternalError(error.message));
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
}

/**
 *
 * @param contractNo
 */
function countByContractNo(contractNo) {
    const deferred = Q.defer();

    Contract.count({
        // contractNo: new RegExp('^' + contractNo + '(-[0-9])?$', "i")
    }, function (error, count) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(count);
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

    Contract.remove({
        _id: id
    }, function (error) {
        if (error) {
            console.error(error);
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
}

module.exports = {
    findById: findById,
    getList: getList,
    getListByDate: getListByDate,
    update: update,
    save: save,
    remove: remove,
    countByContractNo: countByContractNo,
    updateBulk: updateBulk
};