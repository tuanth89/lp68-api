"use strict";

const errors = require('restify-errors');
const StoreRepository = require('../repository/storeRepository');
const AuthorizationService = require('../services/authorizationService');
const config = require('../../config');

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
        .then(function (users) {
            res.send(users);
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
function one(req, res, next) {
    StoreRepository.findById(req.params.storeId)
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

    let _user = AuthorizationService.getUser(req);
    StoreRepository.findById(data._id)
        .then(function (user) {

            if (!AuthorizationService.isAuthorized(_user, user.username)) {
                return next(new errors.ForbiddenError('Resource not found or you do not have enough right'))
            }
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
    let _user = req.user;
    StoreRepository.findById(req.params.storeId)
        .then(function (user) {

            if (!AuthorizationService.isAuthorized(_user, user._id.toString())) {
                return next(new errors.ForbiddenError('Resource not found or you do not have enough right'))
            }

            return user;
        }, function (error) {
            throw error
        })
        .then(function (user) {
            StoreRepository.remove(req.params.storeId)
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

module.exports = {
    create: create,
    list: list,
    one: one,
    update: update,
    remove: remove,
};
