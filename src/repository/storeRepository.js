"use strict";

const Store = require('../models/store');
const Q = require("q");
const errors = require('restify-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const Serializer = require('../serializers/store');
const StringService = require('../services/stringService');

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

    Store
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
 * @param filter
 * @returns {*|promise}
 */
function getList(filter) {
    const deferred = Q.defer();

    // Store
    //     .apiQuery(params)
    //     // .select(Serializer.summary)
    //     .exec(function (error, users) {
    //         if (error) {
    //             console.error(error);
    //             deferred.reject(new errors.InvalidContentError(err.message));
    //         } else {
    //             deferred.resolve(users);
    //         }
    //     });
    //
    // return deferred.promise;


    let query = [];

    // // filter by status
    // if (filter.status) {
    //     query.push({
    //         status: filter.status
    //     });
    // }

    let startRow = (filter.page - 1) * filter.per_page;

    let aggregate = [
        {
            $match: query.length ? {
                $and: query
            } : {}
        },
        {
            $sort: {createdAt: -1}
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: 1
                },
                docs: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $project: {
                total: 1,
                docs: {
                    $slice: ["$docs", startRow, filter.per_page]
                }
            }
        }
    ];

    Store.aggregate(aggregate)
        .then(result => {
            if (result.length === 0) {
                deferred.resolve({
                    docs: [],
                    total: 0
                });
            }
            result = result[0];
            result.page = filter.page;
            result.limit = filter.per_page;
            result.pages = Math.ceil(result.total / filter.per_page);

            deferred.resolve(result);
        })
        .catch(err => {
            deferred.reject(err);
        });

    return deferred.promise;
}

/**
 * @param userId
 * @param isAccountant
 * @param isRoot
 * @returns {*|promise}
 */
function getListForUser(userId, isAccountant, isRoot) {
    const deferred = Q.defer();

    let query = {isActive: true};
    if (isAccountant) {
        query = Object.assign({}, query, {accountant: userId});
    }
    else if (isRoot) {
        
    }
    else {
        query = Object.assign({}, query, {staffs: userId});
    }

    Store
        .find(query)
        .select(Serializer.list)
        .exec(function (err, stores) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(stores);
            }
        });

    return deferred.promise;
}

/**
 * @returns {*|promise}
 */
function getListActive() {
    const deferred = Q.defer();

    let query = {isActive: true};
    Store
        .find(query)
        .select(Serializer.listActive)
        .exec(function (err, stores) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(stores);
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
    data = _.omit(data, ['createdAt', 'updatedAt', '_id', '__v']);

    Store.findOneAndUpdate({
        _id: id
    }, data, {
        new: true,
        runValidators: true
    }, function (error, user) {
        if (error) {
            // deferred.reject(new errors.InvalidContentError("Not found"));
            // return deferred.promise;
            if (error.code) {
                if (error.code === 11000) {
                    let errorMessage = error.message;

                    if (errorMessage.indexOf('storeId') > -1) {
                        deferred.reject(new errors.InvalidContentError('Mã cửa hàng đã tồn tại! Vui lòng kiểm tra lại.'));
                        return deferred.promise;
                    }
                }
            } else {
                let dataErrors = error.errors;
                let message = "";

                for (let key in dataErrors) {
                    let value = dataErrors[key];
                    message = value.message;
                }

                deferred.reject(new errors.InvalidContentError(message));
                return deferred.promise;
            }

        } else {
            deferred.resolve(user);
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

    let store = new Store(data);

    store.save(function (error, user) {
        if (error) {
            // console.error(error);
            // deferred.reject(new errors.InvalidContentError("Not found"));
            // return deferred.promise;
            if (error.code) {
                if (error.code === 11000) {
                    let errorMessage = error.message;

                    if (errorMessage.indexOf('storeId') > -1) {
                        deferred.reject(new errors.InvalidContentError('Mã cửa hàng đã tồn tại! Vui lòng kiểm tra lại.'));
                        return deferred.promise;
                    }
                }
            } else {
                let dataErrors = error.errors;
                let message = "";

                for (let key in dataErrors) {
                    let value = dataErrors[key];
                    message = value.message;
                }

                deferred.reject(new errors.InvalidContentError(message));
                return deferred.promise;
            }

        } else {
            deferred.resolve(user);
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

    Store.remove({
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
 * @param storeId
 * @returns {*|promise}
 */
function getListUserByStore(storeId) {
    const d = Q.defer();
    let query = {_id: storeId};

    Store
        .findOne(query)
        .populate("staffs", '_id fullName')
        .select(Serializer.listByStore)
        .then(result => {
            d.resolve(result);
        }).catch(err => {
        d.reject(err);
    });

    return d.promise;
}

module.exports = {
    findById: findById,
    getList: getList,
    getListForUser: getListForUser,
    getListActive: getListActive,
    getListUserByStore: getListUserByStore,
    update: update,
    save: save,
    remove: remove
};