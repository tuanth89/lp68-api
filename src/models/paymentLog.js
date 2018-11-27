"use strict";

const mongoose = require('mongoose');
// const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');
const validate = require('mongoose-validator');

const PaymentLogSchema = new mongoose.Schema({
    /**
     * Số hợp đồng
     * Trạng thái hợp đồng lúc đóng.
     */
    contract: {
        type: Mixed,
        required: true
    },
    /**
     * Ngày đóng tiền.
     */
    paymentDate: {
        type: Date
    },
    /**
     * Số tiền đóng.
     */
    money: {
        type: Number
    },
    note: {
        type: String
    }

}, {
    minimize: false
});

PaymentLogSchema.plugin(timestamps);
// ContractSchema.plugin(mongooseStringQuery);

const PaymentLog = mongoose.model('PaymentLog', PaymentLogSchema);

module.exports = PaymentLog;