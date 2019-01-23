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

    let hashed = HashService.saltHashPassword(user.password);
    user.password = hashed.passwordHash;
    user.salt = hashed.salt;

    if (user.fullName) {
        if (!user.firstName || !user.lastName) {
            let splitName = user.fullName.trim().split(" ");
            user.firstName = splitName[splitName.length - 1];
            user.lastName = user.fullName.substr(0, user.fullName.length - user.firstName.length).trim();
        }

        user.firstName = StringService.stripHtmlTag(user.firstName);
        user.lastName = StringService.stripHtmlTag(user.lastName);
        user.fullName = StringService.stripHtmlTag(user.fullName);
    }

    if (user.enabled) {
        user.activateToken = "";
        user.activateTokenDate = new Date();
    } else {
        user.activateToken = uuid.v4();
        user.activateTokenDate = moment.utc().add(1, "days");
    }

    user.notificationSetting = {
        notReceiveAnnouncements: !data.receiveNotify,
        receiveInstructorAnnouncements: data.receiveNotify,
        receivePromotions: data.receiveNotify
    };

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

module.exports = {
    findById: findById,
    findByUsername: findByUsername,
    getList: getList,
    update: update,
    save: save,
    remove: remove,
    findByEmail: findByEmail,
    findByUsernameOrEmail: findByUsernameOrEmail,
};