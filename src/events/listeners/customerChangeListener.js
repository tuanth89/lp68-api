"use strict";

const ReportDaily = require('../../models/reportDaily');
const Contract = require('../../models/contract');
const HdLuuThongOther = require('../../models/hdLuuThongOther');
const HdLuuThong = require('../../models/hdLuuThong');
const ContractLog = require('../../models/contractLog');
const log = require('../../../logger').log;
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Remove all contract, luuthong, contractLog by customerId
 * @param {ObjectId} customerId
 * @param {ObjectId} visitorId
 */
function removeAllByCustomerId(customerId, visitorId) {
    Contract.remove({
        customerId: customerId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    ContractLog.remove({
        customerId: customerId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    HdLuuThong.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    HdLuuThongOther.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    ReportDaily.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });
}

/**
 * Remove all contract, luuthong, contractLog by visitor
 * @param {ObjectId} visitorId
 */
function removeAllByVisitor(visitorId) {
    Contract.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    ContractLog.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    HdLuuThong.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    ReportDaily.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });

    HdLuuThongOther.remove({
        creator: visitorId
    }, function (error) {
        if (error) {
            log.error(error);
        }
    });
}


module.exports = {
    removeAllByCustomerId: removeAllByCustomerId,
    removeAllByVisitor: removeAllByVisitor
};