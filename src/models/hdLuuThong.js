"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');

const ContractSchema = new mongoose.Schema({
    contractId: {
        type: ObjectId,
        require: true
    },
    moneyHavePay: {
        type: Number,
        default: 0
    },
    moneyPaid: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        enum: [CONTRACT_OTHER_CONST.STATUS.NORMAL, CONTRACT_OTHER_CONST.STATUS.COMPLETED],
        default: CONTRACT_OTHER_CONST.STATUS.NORMAL
    }

}, {
    minimize: false
});


ContractSchema.plugin(timestamps);
ContractSchema.plugin(mongooseStringQuery);

const Contract = mongoose.model('hdLuuThong', ContractSchema);

module.exports = Contract;