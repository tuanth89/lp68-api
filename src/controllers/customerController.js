"use strict";

const errors = require('restify-errors');
const CustomerRepository = require('../repository/customerRepository');
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

    CustomerRepository.save(data)
        .then(function (customer) {
            res.send(201);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

function createMany(req, res, next) {
    let customers = req.body || {};

    CustomerRepository.insertOrUpdateBulk(customers)
        .then(function (customers) {
            res.send(201, customers);
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
    CustomerRepository.getList(req.params)
        .then(function (customers) {
            res.send(customers);
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
function listAutoComplete(req, res, next) {
    CustomerRepository.getListAutoComplete()
        .then(function (customers) {
            res.send(customers);
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
    CustomerRepository.findById(req.params.customerId)
        .then(function (customer) {
            res.send(customer);
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

    // let _user = AuthorizationService.getUser(req);
    CustomerRepository.update(req.params.customerId, data)
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
    let _user = req.user;
    CustomerRepository.remove(req.params.customerId)
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
    createMany: createMany,
    list: list,
    one: one,
    update: update,
    remove: remove,
    listAutoComplete: listAutoComplete
};
