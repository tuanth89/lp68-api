"use strict";
const CustomerRepository = require('../../repository/customerRepository');
const log = require('../../../logger').log;
// const StringService = require('../../services/stringService');

function newContractListener(customer) {
    CustomerRepository.save(customer)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

module.exports = {
    newContractListener: newContractListener
};