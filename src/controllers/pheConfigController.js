"use strict";

const errors = require('restify-errors');
const PheConfigRepository = require('../repository/pheConfigRepository');
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

    PheConfigRepository.save(data)
        .then(function (pheConfig) {
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
    PheConfigRepository.getList(req.params)
        .then(function (pheConfigs) {
            res.send(pheConfigs);
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
function one(req, res, next) {
    PheConfigRepository.findById(req.params.pheConfigId)
        .then(function (pheConfig) {
            res.send(pheConfig);
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
function updateMany(req, res, next) {
    let data = req.body || {};

    // let _user = AuthorizationService.getUser(req);
    PheConfigRepository.updateBulk(data)
        .then(function () {
            res.send(200);
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
function remove(req, res, next) {
    PheConfigRepository.remove(req.params.pheConfigId)
        .then(function (deleted) {
            res.send(204);
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
    updateMany: updateMany,
    remove: remove
};
