"use strict";

const events = require('events');
const eventEmitter = new events.EventEmitter();
const NewContractListener = require('./listeners/newContractListener');

function newContractListener(customer) {
    eventEmitter.once('LP_NEW_CONTRACT', NewContractListener.newContractListener);

    eventEmitter.emit('LP_NEW_CONTRACT', customer);
}

module.exports = {
    newContractListener: newContractListener
};