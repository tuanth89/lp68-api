"use strict";

const events = require('events');
const eventEmitter = new events.EventEmitter();
const NewContractListener = require('./listeners/newContractListener');
const UpdateContractListener = require('./listeners/updateContractListener');

function createContractLogListener(contracts) {
    eventEmitter.once('LP_NEW_CONTRACT_LOG_EVENT', NewContractListener.createContractLog);

    eventEmitter.emit('LP_NEW_CONTRACT_LOG_EVENT', contracts);
}
function addMultiLogToContractLogListener(contracts) {
    eventEmitter.once('LP_ADD_LOG_TO_CONTRACT_LOG_EVENT', NewContractListener.addMultiLogToContractLog);

    eventEmitter.emit('LP_ADD_LOG_TO_CONTRACT_LOG_EVENT', contracts);
}

function newContractAddedListener(contracts) {
    eventEmitter.once('LP_NEW_CONTRACT_EVENT', NewContractListener.newContractAddedListener);

    eventEmitter.emit('LP_NEW_CONTRACT_EVENT', contracts);
}

function newContractLuuThongListener(contracts) {
    eventEmitter.once('LP_NEW_CONTRACT_LUU_THONG_EVENT', NewContractListener.newContractLuuThongListener);

    eventEmitter.emit('LP_NEW_CONTRACT_LUU_THONG_EVENT', contracts);
}

function updateAndNewLuuThongListener(hdLuuThongId, contractNew) {
    eventEmitter.once('LP_UPDATE_NEW_LUU_THONG_EVENT', NewContractListener.updateAndNewLuuThong);

    eventEmitter.emit('LP_UPDATE_NEW_LUU_THONG_EVENT', hdLuuThongId, contractNew);
}

function updateStatusContractAndLuuThongListener(contract) {
    eventEmitter.once('LP_UPDATE_CONTRACT_LUUTHONG_EVENT', UpdateContractListener.updateStatusLuuThongContract);

    eventEmitter.emit('LP_UPDATE_CONTRACT_LUUTHONG_EVENT', contract);
}

module.exports = {
    createContractLogListener: createContractLogListener,
    addMultiLogToContractLogListener: addMultiLogToContractLogListener,
    newContractAddedListener: newContractAddedListener,
    newContractLuuThongListener: newContractLuuThongListener,
    updateAndNewLuuThongListener: updateAndNewLuuThongListener,
    updateStatusContractAndLuuThongListener: updateStatusContractAndLuuThongListener,
};