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

            query = {status: CONTRACT_CONST.NEW, createdAt: {$gte: dateFrom, $lt: dateTo}};
            break;
        default: // Lưu thông
            dateFilter.addDays(1);
            query = {status: CONTRACT_CONST.NEW, createdAt: {$lt: dateFilter}};
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
 * Tạo mới hoặc Cập nhật số lượng lớn dữ liệu.
 * @param {Array} contracts
 */
function insertOrUpdateBulk(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeOrderedBulkOp();

    Contract.findOne({}).sort({noIdentity: -1})
        .exec(function (error, item) {
                if (error) {
                    deferred.reject(new errors.InvalidContentError(error.message));
                } else {
                    let count = 0;
                    if (item) {
                        count = item.noIdentity;
                    }

                    _.each(contracts, function (contract) {
                        if (!contract._id) {
                            contract._id = new ObjectId();
                            contract.createdAt = new Date();
                        }
                        else {
                            contract.createdAt = new Date(contract.createdAt);
                            contract._id = ObjectId(contract._id);
                            contract.updatedAt = new Date();
                        }

                        if (!contract.contractNo) {
                            // contract.noIdentity = ++count;
                            let nowDate = new Date();
                            contract.contractNo = `${nowDate.getFullYear()}_${++count}`;
                            contract.noIdentity = count;
                        }

                        contract.contractId = contract._id;

                        let startDate = new Date(contract.createdAt);
                        contract.loanEndDate = new Date(startDate.setDate(startDate.getDate() + contract.loanDate));

                        let dailyMoney = contract.actuallyCollectedMoney / (contract.loanDate === 0 ? 1 : contract.loanDate);
                        contract.dailyMoneyPay = dailyMoney.toFixed();

                        // if (contract.loanDate > 0) {
                        //     let dailyMoney = contract.actuallyCollectedMoney / contract.loanDate;
                        //     // contract.dailyMoney = Math.round(dailyMoney * 100) / 100;
                        //     contract.dailyMoney = dailyMoney.toFixed();
                        // }

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
            }
        );

    return deferred.promise;
}

/**
 * Cập nhật tiền đóng hàng ngày.
 * @param {Array} contracts
 */
function updateDailyMoneyBulk(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeOrderedBulkOp();

    _.each(contracts, function (contract) {
        bulk.find({_id: ObjectId(contract._id)})
            .update({$set: {dailyMoney: contract.dailyMoney, dailyMoneyPick: contract.dailyMoneyPick}});
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
 * Cập nhật tổng tiền đóng hàng ngày.
 * @param {Array} contracts
 */
function updateTotalMoney(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeOrderedBulkOp();

    _.each(contracts, function (contract) {
        bulk.find({_id: ObjectId(contract._id)})
            .update({$set: {totalMoneyPaid: contract.totalMoneyPaid}});
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

/**
 *
 * @param contractId
 * @param data
 * @returns {*|promise}
 */
function circulationContract(contractId, data) {
    const deferred = Q.defer();
    let newLoanMoney = parseInt(data.totalMoney) || 0;
    let newActuallyCollectedMoney = parseInt(data.newActuallyCollectedMoney) || 0;
    // let totalMoney = parseInt(data.totalMoney) || 0;
    let newLoanDate = parseInt(data.newLoanDate) || 0;

    Contract.findOne({}).sort({noIdentity: -1})
        .exec(function (error, contractItem) {
                let countIndetity = contractItem.noIdentity || 0;
                let nowDate = new Date();

                let contractNew = new Contract();
                contractNew.customer = data.customer;
                contractNew.createdAt = new Date();
                contractNew.loanMoney = newLoanMoney;
                contractNew.actuallyCollectedMoney = newActuallyCollectedMoney;
                contractNew.loanDate = newLoanDate;
                contractNew.contractHistory = [];
                contractNew.contractHistory.push(contractId);
                contractNew.contractNo = `${nowDate.getFullYear()}_${++countIndetity}`;
                contractNew.noIdentity = countIndetity;
                let startDate = nowDate;
                startDate.setDate(startDate.getDate() + contractNew.loanDate);
                contractNew.loanEndDate = new Date(startDate);
                let dailyMoney = contractNew.actuallyCollectedMoney / (contractNew.loanDate === 0 ? 1 : contractNew.loanDate);
                contractNew.dailyMoney = dailyMoney.toFixed();

                Contract.update({_id: contractId}, {
                    $set: {
                        status: CONTRACT_CONST.END,
                        updatedAt: new Date()
                    }
                }, function (error, user) {
                    if (error) {
                        console.error(error);
                        deferred.reject(new errors.InvalidContentError(error.message));
                    } else {
                        contractNew.save(function (error, item) {
                            if (error) {
                                console.error(error);
                                deferred.reject(new errors.InvalidContentError(error.message));
                            }
                            else {
                                deferred.resolve(item);
                            }
                        });

                    }
                });
            }
        );


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
    insertOrUpdateBulk: insertOrUpdateBulk,
    updateDailyMoneyBulk: updateDailyMoneyBulk,
    circulationContract: circulationContract,
    updateTotalMoney: updateTotalMoney

};