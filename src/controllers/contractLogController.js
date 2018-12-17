"use strict";

const errors = require('restify-errors');
const ContractLogRepository = require('../repository/contractLogRepository');
const AuthorizationService = require('../services/authorizationService');
const EventDispatcher = require('../events/dispatcher');
const _ = require('lodash');


/**
 *
 * @param req
 * @param res
 * @param next
 */
function one(req, res, next) {
    ContractLogRepository.findAllByContractId(req.params.contractId)
        .then(function (contract) {
            res.send(contract);
            next();
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
 */
function addHistory(req, res, next) {
    let data = req.body || {};

    let contractId = req.params.contractId;
    ContractLogRepository.findByContractId(contractId)
        .then(function (lecture) {
            ContractLogRepository.addHistory(contractId, data)
                .then(function (result) {
                    res.send(200, data);
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

module.exports = {
    one: one,
    addHistory: addHistory
};
