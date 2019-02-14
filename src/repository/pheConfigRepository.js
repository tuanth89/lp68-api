"use strict";

const PheConfig = require('../models/pheConfig');
const Q = require("q");
const errors = require('restify-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');


/**
 *
 * @param id
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();

    PheConfig
        .findOne({
            _id: id
        })
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
 * @param params
 * @returns {*|promise}
 */
function getList(params) {
    const deferred = Q.defer();
    let isNewCustomer = params.isNewCustomer === "true";

    PheConfig
        .find({isNewCustomer: isNewCustomer})
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

/**
 *
 * @param data
 * @returns {*|promise}
 */
function save(data) {
    const deferred = Q.defer();

    findById(data._id)
        .then((item) => {
            if (item) {
                deferred.resolve(item);
            }
            else {
                let pheConfig = new PheConfig(data);
                pheConfig.save(function (error, user) {
                    if (error) {
                        console.error(error);

                        deferred.reject(new errors.InvalidContentError("Not found"));
                        return deferred.promise;

                        // deferred.reject(new errors.InternalError(error.message));
                    } else {
                        deferred.resolve(user);
                    }
                });
            }

        })
        .catch((error) => {
            console.error(error);

            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
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

    PheConfig.remove({
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
 * Cập nhật số lượng lơn dữ liệu.
 * @param {Array} data
 */
function updateBulk(data) {
    const deferred = Q.defer();
    let bulk = PheConfig.collection.initializeUnorderedBulkOp();
    _.each(data, function (item) {
        if (!item._id) {
            item._id = new ObjectId();
            item.createdAt = new Date();
        }
        else {
            item.createdAt = new Date(item.createdAt);
            item._id = ObjectId(item._id);
            item.updatedAt = new Date();
        }

        let pheConfigItem = new PheConfig(item);

        bulk.find({_id: ObjectId(pheConfigItem._id)})
            // .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(pheConfigItem);
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
}


module.exports = {
    findById: findById,
    getList: getList,
    save: save,
    remove: remove,
    updateBulk: updateBulk
};