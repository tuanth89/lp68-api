"use strict";
const CustomerRepository = require('../../repository/customerRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;
// const StringService = require('../../services/stringService');

function newContractAddedListener(contracts) {
    HdLuuThongRepository.insertMany(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

module.exports = {
    newContractAddedListener: newContractAddedListener
};