"use strict";

const Customer = require('../models/customer');
const Q = require("q");
const errors = require('restify-errors');
const Serializer = require('../serializers/customer');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const StringService = require('../services/stringService');
const USER_CONSTANT = require('../constant/userConstant');


/**
 *
 * @param id
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();

    // if (ObjectId.isValid(id)) {
    // if (StringService.isObjectId(id)) {
    //     id = new ObjectId(id);
    // }

    Customer
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
    let storeId = params.storeId;
    let userId = params.userId;
    let isAccountant = params.isAccountant;
    let isRoot = params.isRoot;
    let query = {};

    if (isAccountant || !isRoot)
        if (StringService.isObjectId(storeId))
            query = {storeId: storeId};

    // if (userId && !isAccountant && !isRoot) {
    if (userId && !isRoot) {
        query = Object.assign({}, query, {visitor: ObjectId(userId)});
    }

    Customer
        .find(query)
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
 * @param params
 * @returns {*|promise}
 */
function getListAutoComplete(params) {
    const deferred = Q.defer();
    let storeId = params.storeId;
    let isRoot = params.isRoot;
    let isAccountant = params.isAccountant;
    let userId = params.userId;
    let query = {};

    if (isAccountant || !isRoot) {
        if (storeId)
            query.storeId = storeId;
    }

    if (userId && !isRoot) {
        query = Object.assign({}, query, {visitor: userId});
    }

    Customer
        .find(query)
        .select(Serializer.sourceList)
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

function insertOrUpdateBulk(customers) {
    const deferred = Q.defer();

    let bulk = Customer.collection.initializeOrderedBulkOp();
    _.each(customers, function (customer) {
        if (!customer._id) {
            customer._id = new ObjectId();
            customer.createdAt = new Date();
        }
        else {
            customer.createdAt = new Date(customer.createdAt);
            customer._id = ObjectId(customer._id);
            customer.updatedAt = new Date();
        }

        let item = new Customer(customer);

        bulk.find({_id: ObjectId(item._id)})
            .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(item);
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(customers);
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
        // .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
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
 * @param data
 * @returns {*|promise}
 */
function update(id, data) {
    const deferred = Q.defer();

    Customer.findOneAndUpdate({
        _id: id
    }, data, {
        new: true
    }, function (error, customer) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(customer);
        }
    });

    return deferred.promise;
}

/**
 *
 * @param id
 * @param imgDocs
 * @param isAdd
 * @returns {*|promise}
 */
function updateImgDocs(id, imgDocs, isAdd) {
    const deferred = Q.defer();

    let updateImgDocs = isAdd > 0 ? {"$push": {"imgDocs": {"$each": imgDocs}}} : {"$pull": {"imgDocs": imgDocs}};

    Customer.findOneAndUpdate({
        _id: id
    }, updateImgDocs, function (error, customer) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(customer);
        }
    });

    return deferred.promise;
}

/**
 * @desc Kiểm tra tồn tại CMT hoặc sổ hộ khảu trong hệ thống.
 * @param customerId
 * @param data
 * @returns {*|promise}
 */
function checkExists(customerId, data) {
    const deferred = Q.defer();
    let query = {};

    if (data.numberId)
        query = {numberId: data.numberId, _id: {$ne: ObjectId(customerId)}};

    if (data.houseHolderNo)
        query = {houseHolderNo: data.houseHolderNo, _id: {$ne: ObjectId(customerId)}};

    Customer
        .findOne(query)
        .exec(function (err, user) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(user);
            }
        });

    return deferred.promise;
}

/**
 * @desc Kiểm tra cửa hàng đã có khách hàng nào được nhập chưa ==> để xóa cửa hàng.
 * @param storeId
 */
function checkCustomerByStore(storeId) {
    const deferred = Q.defer();
    let query = {};
    if (StringService.isObjectId(storeId))
        query = {storeId: storeId};

    Customer.findOne(query, function (error, customer) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(customer);
        }
    });

    return deferred.promise;
}

module.exports = {
    findById: findById,
    getList: getList,
    insertOrUpdateBulk: insertOrUpdateBulk,
    save: save,
    update: update,
    remove: remove,
    updateBulk: updateBulk,
    getListAutoComplete: getListAutoComplete,
    updateImgDocs: updateImgDocs,
    checkExists: checkExists,
    checkCustomerByStore: checkCustomerByStore
};