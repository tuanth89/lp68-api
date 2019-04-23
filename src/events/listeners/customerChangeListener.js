"use strict";

const Contract = require('../../models/contract');
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

}


module.exports = {
    removeAllByCustomerId: removeAllByCustomerId
}