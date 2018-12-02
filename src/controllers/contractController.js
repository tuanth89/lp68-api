"use strict";

const errors = require('restify-errors');
const ContractRepository = require('../repository/contractRepository');
const CustomerRepository = require('../repository/customerRepository');
const AuthorizationService = require('../services/authorizationService');
const EventDispatcher = require('../events/dispatcher');
const _ = require('lodash');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function insertOrUpdateBulk(req, res, next) {
    let data = req.body || {};
    let customerArr = [];

    _.forEach(data, (item) => {
        customerArr.push(item.customer);
    });

    CustomerRepository.updateBulk(customerArr)
        .then((customers) => {
            ContractRepository.insertOrUpdateBulk(data)
                .then(function (contracts) {
                    res.send(201, data);
                    next();
                });
        })
        .catch((error) => {
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
    ContractRepository.getList(req.params)
        .then(function (contracts) {
            res.send(contracts);
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
function listByDate(req, res, next) {
    let date = req.params.date || new Date();
    let type = req.params.type || -1;
    ContractRepository.getListByDate(date, type)
        .then(function (contracts) {
            res.send(contracts);
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
    ContractRepository.findById(req.params.contractId)
        .then(function (contract) {
            res.send(contract);
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
    ContractRepository.update(data._id, data)
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
 * @returns {*}
 */
function updateDailyMoneyBulk(req, res, next) {
    let data = req.body || {};

    // let _user = AuthorizationService.getUser(req);
    ContractRepository.updateDailyMoneyBulk(data)
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
    ContractRepository.remove(req.params.user_id)
        .then(function (deleted) {
            res.send(204);
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
 * @returns {*}
 */
function circulationContract(req, res, next) {
    let data = req.body || {};

    if (data.newLoanMoney <= 0) {
        return next(new errors.InvalidContentError("Số tiền vay không được <= 0"));
    }

    // let _user = AuthorizationService.getUser(req);
    ContractRepository.circulationContract(req.params.contractId, data)
        .then(function (contract) {
            res.send(201, contract);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

module.exports = {
    insertOrUpdateBulk: insertOrUpdateBulk,
    list: list,
    listByDate: listByDate,
    one: one,
    update: update,
    remove: remove,
    updateDailyMoneyBulk: updateDailyMoneyBulk,
    circulationContract: circulationContract

};
