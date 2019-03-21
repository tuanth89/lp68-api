"use strict";

const User = require('../models/user');
const Q = require("q");
const errors = require('restify-errors');
const HashService = require('../services/hashService');
const Serializer = require('../serializers/user');
const uuid = require('uuid');
const moment = require('moment');
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
    if (StringService.isObjectId(id)) {
        id = new ObjectId(id);
    }

    User
        .findOne({
            _id: id
        })
        .select(Serializer.detail)
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
 * @param username
 * @returns {*|promise}
 */
function findByUsername(username) {
    const deferred = Q.defer();
    let query = {};

    // if (ObjectId.isValid(username)) {
    if (StringService.isObjectId(username)) {
        query = {
            _id: ObjectId(username)
        };
    } else {
        query = {
            username: username
        };
    }

    User
        .findOne(query)
        .select(Serializer.findByUsername)
        .exec(function (err, user) {
            if (err) {
                console.error(err);
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(user);
            }
        });

    return deferred.promise;
}

/**
 *
 * @param email
 * @returns {*|promise}
 */
function findByEmail(email) {
    const deferred = Q.defer();

    User
        .findOne({
            email: email
        })
        .select(Serializer.detail)
        .exec(function (err, user) {
            if (err) {
                console.error(err);
                deferred.reject(new errors.InvalidContentError(err.message));
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

    User
        .apiQuery(params)
        .select(Serializer.summary)
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
    data = _.omit(data, ['createdAt', 'updatedAt', '_id', '__v']);

    if (data.password) {
        let hashed = HashService.saltHashPassword(data.password);
        data.password = hashed.passwordHash;
        data.salt = hashed.salt;
    }

    if (data.fullName) {
        data.fullNameUnsign = StringService.removeSignInString(data.fullName);
    }

    try {
        User.findOneAndUpdate({
            _id: id
        }, data, {
            new: true,
            runValidators: true
        }, function (error, user) {
            if (error) {
                deferred.reject(new errors.InvalidContentError("Not found"));
                return deferred.promise;
            } else {
                deferred.resolve(user);
            }
        });
    } catch (err) {
        deferred.resolve(user);
    }


    return deferred.promise;
}

/**
 *
 * @param data
 * @returns {*|promise}
 */
function save(data) {
    const deferred = Q.defer();

    let user = new User(data);

    if (!user.fullName || !user.password || !user.email) {
        deferred.reject(new errors.InvalidContentError('"name", "password" và "email" không được để trống!'));
        return deferred.promise;
    }

    if (user.fullName) {
        user.fullNameUnsign = StringService.removeSignInString(user.fullName);

        let arr = user.fullNameUnsign.split(" ");
        if (arr.length > 0) {
            let userName = arr[arr.length - 1];

            if (arr.length > 1) {
                arr.splice(arr.length - 1, 1);

                user.username = userName + arr.map((item) => item[0]).join('');
            }
            else {
                user.username = userName;
            }
        }
    }

    let hashed = HashService.saltHashPassword(user.password);
    user.password = hashed.passwordHash;
    user.salt = hashed.salt;

    user.save(function (error, user) {
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
 * @param id
 * @returns {*|promise}
 */
function remove(id) {
    const deferred = Q.defer();

    User.remove({
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
 * @param usernameOrEmail
 * @returns {*|promise}
 */

function findByUsernameOrEmail(usernameOrEmail) {
    const deferred = Q.defer();

    User
        .findOne({
            $or: [{
                username: usernameOrEmail
            }, {
                email: usernameOrEmail
            }]
        })
        // .findOne({email: usernameOrEmail})
        .exec(function (err, user) {
            if (err) {
                console.error(err);
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
function getListUserSystem(filter) {
    const d = Q.defer();

    let query = [];

    if (filter.search) {
        filter.search = StringService.getRegexSearchString(filter.search);
        query.push({
            $or: [
                {
                    fullName: {
                        $regex: filter.search,
                        $options: "i"
                    }
                },
                {
                    fullNameUnsign: {
                        $regex: filter.search,
                        $options: "i"
                    }
                }
            ]
        });
    }

    query.push({
        roles: {$nin: filter.roles}
    });

    let startRow = (filter.page - 1) * filter.per_page;

    let aggregate = [
        {
            $match: query.length ? {
                $and: query
            } : {}
        },
        {
            $sort: {createdAt: -1}
        }
    ];

    aggregate.push({
        $group: {
            _id: null,
            total: {
                $sum: 1
            },
            docs: {
                $push: '$$ROOT'
            }
        }
    });

    aggregate.push({
        $project: {
            total: 1,
            docs: {
                $slice: ['$docs', startRow, filter.per_page]
            }
        }
    });

    User.aggregate(aggregate).then(result => {
        if (result.length === 0) {
            d.resolve({
                docs: [],
                total: 0
            });
        }
        result = result[0];
        result.page = filter.page;
        result.limit = filter.per_page;
        result.pages = Math.ceil(result.total / filter.per_page);

        d.resolve(result);
    }).catch(err => {
        d.reject(err);
    });

    return d.promise;
}

/**
 *
 * @returns {*|promise}
 */
function getListUser() {
    const d = Q.defer();

    User
        .find({roles: {$nin: [USER_CONSTANT.ROLE_ROOT]}})
        .select(Serializer.forStore)
        .then(result => {
            d.resolve(result);
        }).catch(err => {
        d.reject(err);
    });

    return d.promise;
}

module.exports = {
    findById: findById,
    findByUsername: findByUsername,
    getList: getList,
    update: update,
    save: save,
    remove: remove,
    findByEmail: findByEmail,
    findByUsernameOrEmail: findByUsernameOrEmail,
    getListUserSystem: getListUserSystem,
    getListUser: getListUser
};