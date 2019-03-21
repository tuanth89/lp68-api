"use strict";

const events = require('events');
const eventEmitter = new events.EventEmitter();
const NewContractListener = require('./listeners/newContractListener');
const UpdateContractListener = require('./listeners/updateContractListener');

function insertOrUpdateBulkContractLogListener(contracts) {
    eventEmitter.once('LP_BATCH_LOG_LOG_EVENT', NewContractListener.insertOrUpdateBulkContractLog);

    eventEmitter.emit('LP_BATCH_LOG_LOG_EVENT', contracts);
}

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

function checkContractNoListener(contracts) {
    eventEmitter.once('LP_CHECK_CONTRACT_NO_EVENT', NewContractListener.checkContractNo);

    eventEmitter.emit('LP_CHECK_CONTRACT_NO_EVENT', contracts);
}

function newContractOldAddedListener(contracts) {
    eventEmitter.once('LP_OLD_CONTRACT_EVENT', NewContractListener.newContractOldAddedListener);

    eventEmitter.emit('LP_OLD_CONTRACT_EVENT', contracts);
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

function removeAllByContractListener(contract) {
    eventEmitter.once('LP_REMOVE_ALL_BY_CONTRACT_EVENT', NewContractListener.removeAllByContract);

    eventEmitter.emit('LP_REMOVE_ALL_BY_CONTRACT_EVENT', contract);
}

function updatePheForStaffListener(contractId) {
    eventEmitter.once('LP_UPDATE_PHE_FOR_STAFF_EVENT', NewContractListener.updatePheForStaff);

    eventEmitter.emit('LP_UPDATE_PHE_FOR_STAFF_EVENT', contractId);
}

module.exports = {
    insertOrUpdateBulkContractLogListener: insertOrUpdateBulkContractLogListener,
    createContractLogListener: createContractLogListener,
    addMultiLogToContractLogListener: addMultiLogToContractLogListener,
    newContractAddedListener: newContractAddedListener,
    newContractOldAddedListener: newContractOldAddedListener,
    newContractLuuThongListener: newContractLuuThongListener,
    updateAndNewLuuThongListener: updateAndNewLuuThongListener,
    updateStatusContractAndLuuThongListener: updateStatusContractAndLuuThongListener,
    removeAllByContractListener: removeAllByContractListener,
    checkContractNoListener: checkContractNoListener,
    updatePheForStaffListener: updatePheForStaffListener
};