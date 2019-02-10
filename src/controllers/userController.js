"use strict";

const errors = require('restify-errors');
const UserRepository = require('../repository/userRepository');
const UserConstant = require('../constant/userConstant');
const AuthorizationService = require('../services/authorizationService');
const path = require('path');
const config = require('../../config');
const uuid = require('uuid');
const moment = require('moment');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function create(req, res, next) {
    let data = req.body || {};

    UserRepository.save(data)
        .then(function (user) {
            // if administrator create user.
            if (user.enabled) {
                res.send(201);
                next();
            } else {// if student register account.
                res.send(201);
                next();
            }
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next) {
    if (req.params.search) {
        UserRepository.searchByName(req.params.search)
            .then(function (users) {
                res.send(users);
                next();
            })
            .catch(function (error) {
                return next(error);
            })
            .done();
    } else {
        UserRepository.getList(req.params)
            .then(function (users) {
                res.send(users);
                next();
            })
            .catch(function (error) {
                return next(error);
            })
            .done();
    }
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function one(req, res, next) {
    UserRepository.findByUsername(req.params.username)
        .then(function (user) {

            res.send(user);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done()
    ;
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function update(req, res, next) {
    let data = req.body || {};

    if (!data._id) {
        data = Object.assign({}, data, {_id: req.params.user_id});
    }

    let _user = AuthorizationService.getUser(req);
    UserRepository.findById(_user.id)
        .then(function (user) {

            if (!AuthorizationService.isAuthorized(_user, user.username)) {
                return next(new errors.ForbiddenError('Resource not found or you do not have enough right'))
            }
            UserRepository.update(data._id, data)
                .then(function () {
                    res.send(200, user);
                    next();
                })
                .catch(function (error) {
                    return next(error);
                })
                .done();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
    let _user = req.user;
    UserRepository.findById(req.params.user_id)
        .then(function (user) {

            if (!AuthorizationService.isAuthorized(_user, user._id.toString())) {
                return next(new errors.ForbiddenError('Resource not found or you do not have enough right'))
            }

            return user;
        }, function (error) {
            throw error
        })
        .then(function (user) {
            UserRepository.remove(req.params.user_id)
                .then(function (deleted) {
                    res.send(204);
                    next();
                })
                .catch(function (error) {
                    throw error;
                })
        }, function (error) {
            throw error;
        })
        .catch(function (error) {
            return next(error);
        })
        .done()
    ;
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function createUserSystem(req, res, next) {
    let data = req.body || {};
    UserRepository.save(data)
        .then(function (user) {
            res.send(201);
            next();
        })
        .catch(function (error) {
            res.send(201,error);
            next();
            // return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateUserSystem(req, res, next) {
    let data = req.body || {};

    if (!data._id) {
        data = Object.assign({}, data, {_id: req.params.user_id});
    }

    if (!data.birthday) {
        return next(new errors.InvalidContentError("Ngày sinh không được để trống!"));
    }

    // if (data.birthday && data.birthday.includes('/')) {
    //     data.birthday = moment(data.birthday, "DD/MM/YYYY").format("YYYY-MM-DD");
    // }

    let _user = AuthorizationService.getUser(req);
    UserRepository.findById(_user.id)
        .then(function (user) {
            UserRepository.update(data._id, data)
                .then(function () {
                    res.send(200, user);
                    next();
                })
                .catch(function (error) {
                    return next(error);
                })
                .done();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

function listUserSystem(req, res, next) {
    req.params.page = parseInt(req.params.page, 10) || config.pagination.page;
    req.params.per_page = parseInt(req.params.per_page, 10) || config.pagination.limit;
    req.params.roles = [UserConstant.ROLE_ROOT];

    UserRepository.getListUserSystem(req.params)
        .then(function (users) {
            res.send(users);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

function listUser(req, res, next) {
    UserRepository.getListUser()
        .then(function (users) {
            res.send(users);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

module.exports = {
    create: create,
    list: list,
    one: one,
    update: update,
    remove: remove,
    createUserSystem: createUserSystem,
    updateUserSystem: updateUserSystem,
    listUserSystem: listUserSystem,
    listUser: listUser
};
