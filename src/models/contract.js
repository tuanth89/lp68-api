"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');
const CONTRACT_CONST = require('../constant/contractConstant');

const ContractSchema = new mongoose.Schema({
    contractNo: {
        type: String,
        unique: true,
        required: false
    },
    contractHistory: {
        type: Array
    },
    contractDate: {
        type: Date
    },
    customer: {
        type: Mixed
    },
    disableReason: {
        type: String
    },
    /**
     * Số tiền vay.
     */
    loanMoney: {
        type: Number
    },
    /**
     * Số thực thu (Tiền vay + lãi).
     */
    actuallyCollectedMoney: {
        type: Number
    },
    /**
     * Số ngày vay.
     */
    loanDate: {
        type: Number
    },
    /**
     * Số tiền phải đóng hàng ngày (Tự chia theo Tiền thực thu/Số ngày).
     */
    dailyMoney: {
        type: Number
    },
    /**
     * Số ngày hết hạn vay (Tự động tính theo ngày vay + số ngày vay).
     */
    loanEndDate: {
        type: Date
    },
    note: {
        type: String
    },
    status: {
        type: Number,
        enum: CONTRACT_CONST,
        default: CONTRACT_CONST.NEW,
        required: true
    },
    creator:{
        type: ObjectId
    },
    lastUserUpdate:{
        type: ObjectId
    }
}, {
    minimize: false
});

// ContractSchema.index({
//     phone: 'text',
//     email: 'text',
//     disableReason: 'text'
// });

ContractSchema.plugin(timestamps);
ContractSchema.plugin(mongooseStringQuery);

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;