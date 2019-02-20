"use strict";

const errors = require('restify-errors');
const CustomerRepository = require('../repository/customerRepository');
const AuthorizationService = require('../services/authorizationService');
const UserRepository = require('../repository/userRepository');
const ContractRepository = require('../repository/contractRepository');

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
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    req.params.roles = _user.userRoles;

    // UserRepository.findById(_user.id)
    //     .then((userItem) => {
    //         req.params.isAccountant = userItem.isAccountant;
    CustomerRepository.getListAutoComplete(req.params)
        .then(function (customers) {
            res.send(customers);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
    // })
    // .catch(function (error) {
    //     return next(error);
    // })
    // .done();
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
    // let _user = req.user;
    let customerId = req.params.customerId;

    ContractRepository.checkCustomerContractToDel(customerId)
        .then((contract) => {
            if (!contract) {
                CustomerRepository.remove(customerId)
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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateImgDocs(req, res, next) {
    let data = req.body || {};

    CustomerRepository.updateImgDocs(req.params.customerId, data.imgDocs, data.isAdd)
        .then(function (customer) {
            res.send(200, customer);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * @desc Kiểm tra tồn tại CMT hoặc sổ hộ khảu trong hệ thống.
 * @param req
 * @param res
 * @param next
 */
function checkExists(req, res, next) {
    let data = req.body || {};

    CustomerRepository.checkExists(req.params.customerId, data)
        .then(function (customer) {
            let response = false;
            if (customer)
                response = true;

            res.send(response);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done()
    ;
}

module.exports = {
    create: create,
    createMany: createMany,
    list: list,
    one: one,
    update: update,
    remove: remove,
    listAutoComplete: listAutoComplete,
    updateImgDocs: updateImgDocs,
    checkExists: checkExists
};
