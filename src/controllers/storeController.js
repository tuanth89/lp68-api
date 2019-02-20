"use strict";

const errors = require('restify-errors');
const StoreRepository = require('../repository/storeRepository');
const UserRepository = require('../repository/userRepository');
const CustomerRepository = require('../repository/customerRepository');
const AuthorizationService = require('../services/authorizationService');
const config = require('../../config');
const UserConstant = require('../constant/userConstant');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function create(req, res, next) {
    let data = req.body || {};

    StoreRepository.save(data)
        .then(function (store) {
            res.send(201);
            next();
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
    // if (req.params.search) {
    //     StoreRepository.searchByName(req.params.search)
    //         .then(function (users) {
    //             res.send(users);
    //             next();
    //         })
    //         .catch(function (error) {
    //             return next(error);
    //         })
    //         .done();
    // } else {

    req.params.page = parseInt(req.params.page) || config.pagination.page;
    req.params.per_page = parseInt(req.params.per_page) || config.pagination.limit;

    StoreRepository.getList(req.params)
        .then(function (stores) {
            res.send(stores);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
    // }
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function listForUser(req, res, next) {
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }

    UserRepository.findById(_user.id)
        .then((userItem) => {
            StoreRepository.getListForUser(userItem._id, userItem.isAccountant, userItem.roles.indexOf(UserConstant.ROLE_ROOT) >= 0)
                .then(function (stores) {
                    res.send(stores);
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
function one(req, res, next) {
    StoreRepository.findById(req.params.storeId)
        .then(function (store) {
            res.send(store);
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

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }

    StoreRepository.findById(data._id)
        .then(function (user) {
            // if (!AuthorizationService.isAuthorized(_user, user.username)) {
            //     return next(new errors.ForbiddenError('Resource not found or you do not have enough right'))
            // }
            StoreRepository.update(data._id, data)
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
    // let _user = req.user;
    let storeId = req.params.storeId || "";

    CustomerRepository.checkCustomerByStore(storeId)
        .then((customer) => {
            if (!customer) {
                StoreRepository.remove(storeId)
                    .then(function (deleted) {
                        res.send(200, {removed: true});
                        next();
                    });
            }
            else {
                res.send(200, {removed: false});
                next();
            }
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

function listActive(req, res, next) {
    StoreRepository.getListActive()
        .then(function (stores) {
            res.send(stores);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

function listUserByStore(req, res, next) {
    let storeId = req.params.storeId || "";
    StoreRepository.getListUserByStore(storeId)
        .then(function (stores) {
            res.send(stores);
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
    listForUser: listForUser,
    listActive: listActive,
    listUserByStore: listUserByStore,
    one: one,
    update: update,
    remove: remove,
};
