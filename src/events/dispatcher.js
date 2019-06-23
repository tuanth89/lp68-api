"use strict";

const events = require('events');
const eventEmitter = new events.EventEmitter();
const NewContractListener = require('./listeners/newContractListener');
const UpdateContractListener = require('./listeners/updateContractListener');
const CustomerChangeListener = require('./listeners/customerChangeListener');
const ReportDailyChangeListener = require('./listeners/reportDailyChangeListener');

function insertOrUpdateBulkContractLogListener(data) {
    eventEmitter.once('LP_BATCH_LOG_LOG_EVENT', NewContractListener.insertOrUpdateBulkContractLog);

    eventEmitter.emit('LP_BATCH_LOG_LOG_EVENT', data);
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

function updateAndNewLuuThongListener(hdLuuThongId, contractNew, contractOldId) {
    eventEmitter.once('LP_UPDATE_NEW_LUU_THONG_EVENT', NewContractListener.updateAndNewLuuThong);

    eventEmitter.emit('LP_UPDATE_NEW_LUU_THONG_EVENT', hdLuuThongId, contractNew, contractOldId);
}

function updateStatusContractAndLuuThongListener(contract) {
    eventEmitter.once('LP_UPDATE_CONTRACT_LUUTHONG_EVENT', UpdateContractListener.updateStatusLuuThongContract);

    eventEmitter.emit('LP_UPDATE_CONTRACT_LUUTHONG_EVENT', contract);
}

function removeAllByContractListener(contract) {
    eventEmitter.once('LP_REMOVE_ALL_BY_CONTRACT_EVENT', NewContractListener.removeAllByContract);

    eventEmitter.emit('LP_REMOVE_ALL_BY_CONTRACT_EVENT', contract);
}

function updatePheForStaffListener(contractId, isCustomerNew) {
    eventEmitter.once('LP_UPDATE_PHE_FOR_STAFF_EVENT', NewContractListener.updatePheForStaff);

    eventEmitter.emit('LP_UPDATE_PHE_FOR_STAFF_EVENT', contractId, isCustomerNew);
}

function updateContractTotalMoneyPaidListener(data) {
    eventEmitter.once('LP_UPDATE_CONTRACT_TOTALMONEYPAID_EVENT', UpdateContractListener.updateContractTotalMoneyPaid);

    eventEmitter.emit('LP_UPDATE_CONTRACT_TOTALMONEYPAID_EVENT', data);
}

function updateContractDongTruoc(data) {
    eventEmitter.once('LP_UPDATE_CONTRACT_DONGTRUOC_EVENT', UpdateContractListener.updateContractDongTruoc);

    eventEmitter.emit('LP_UPDATE_CONTRACT_DONGTRUOC_EVENT', data);
}

function removeAllByCustomerId(customerId, visitorId) {
    eventEmitter.once('LP_REMOVE_ALL_BY_CUSTOMER_EVENT', CustomerChangeListener.removeAllByCustomerId);

    eventEmitter.emit('LP_REMOVE_ALL_BY_CUSTOMER_EVENT', customerId, visitorId);
}

function removeByVisitorListener(visitorId) {
    eventEmitter.once('LP_REMOVE_ALL_BY_VISITOR_EVENT', CustomerChangeListener.removeAllByVisitor);

    eventEmitter.emit('LP_REMOVE_ALL_BY_VISITOR_EVENT', visitorId);
}

function totalLuuThongTangGiamListener(data, isLuuThongTang) {
    eventEmitter.once('LP_REPORT_DAILY_LT_TANG_GIAM_EVENT', ReportDailyChangeListener.totalLuuThongTangDaily);

    eventEmitter.emit('LP_REPORT_DAILY_LT_TANG_GIAM_EVENT', data, isLuuThongTang);
}

function daoTangGiamReportDailyListener(data) {
    eventEmitter.once('LP_REPORT_DAILY_DAO_TANG_GIAM_EVENT', ReportDailyChangeListener.daoTangGiamReportDaily);

    eventEmitter.emit('LP_REPORT_DAILY_DAO_TANG_GIAM_EVENT', data);
}

function editMoneyPaidPerDayListener(data) {
    eventEmitter.once('LP_EDIT_MONEY_PAID_EVENT', UpdateContractListener.editMoneyPaidPerDay);

    eventEmitter.emit('LP_EDIT_MONEY_PAID_EVENT', data);
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
    updatePheForStaffListener: updatePheForStaffListener,
    updateContractTotalMoneyPaidListener: updateContractTotalMoneyPaidListener,
    updateContractDongTruoc: updateContractDongTruoc,
    removeAllByCustomerId: removeAllByCustomerId,
    removeByVisitorListener: removeByVisitorListener,
    totalLuuThongTangGiamListener: totalLuuThongTangGiamListener,
    daoTangGiamReportDailyListener: daoTangGiamReportDailyListener,
    editMoneyPaidPerDayListener: editMoneyPaidPerDayListener
};
