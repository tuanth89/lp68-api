"use strict";

const Customer = require('../models/customer');
const Q = require("q");
const errors = require('restify-errors');
const Serializer = require('../serializers/user');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
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

    Customer
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

    Customer
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

/**
 *
 * @param id
 * @param data
 * @returns {*|promise}
 */
function update(id, data) {
    const deferred = Q.defer();

    Customer.findOneAndUpdate({
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
                let customer = new Customer(data);
                customer.save(function (error, user) {
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
 * Cập nhật số lượng lơn dữ liệu.
 * @param {Array} customers
 */
function updateBulk(customers) {
    const deferred = Q.defer();
    let bulk = Customer.collection.initializeUnorderedBulkOp();
    _.each(customers, function (item) {
        if (!item._id) {
            item._id = new ObjectId();
            item.createdAt = new Date();
        }
        else {
            item.createdAt = new Date(item.createdAt);
            item._id = ObjectId(item._id);
            item.updatedAt = new Date();
        }

        let customerItem = new Customer(item);

        bulk.find({_id: ObjectId(customerItem._id)})
            .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(customerItem);
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

/**
 *
 * @param id
 * @returns {*|promise}
 */
function remove(id) {
    const deferred = Q.defer();

    Customer.remove({
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
    update: update,
    save: save,
    remove: remove,
    updateBulk: updateBulk
};