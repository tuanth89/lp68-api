"use strict";

const events = require('events');
const eventEmitter = new events.EventEmitter();
const NewContractListener = require('./listeners/newContractListener');

function newContractAddedListener(contracts) {
    eventEmitter.once('LP_NEW_CONTRACT_EVENT', NewContractListener.newContractAddedListener);

    eventEmitter.emit('LP_NEW_CONTRACT_EVENT', contracts);
}

function newContractLuuThongListener(contracts) {
    eventEmitter.once('LP_NEW_CONTRACT_LUU_THONG_EVENT', NewContractListener.newContractLuuThongListener);

    eventEmitter.emit('LP_NEW_CONTRACT_LUU_THONG_EVENT', contracts);
}

module.exports = {
    newContractAddedListener: newContractAddedListener,
    newContractLuuThongListener: newContractLuuThongListener
};