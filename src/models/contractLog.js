"use strict";

const mongoose = require('mongoose');
// const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');
const validate = require('mongoose-validator');
const CONTRACT_CONST = require('src/constant/contractConstant');

const ContractLogSchema = new mongoose.Schema({
    contractNo: {
        type: String,
        unique: true,
        required: false
    }
}, {
    minimize: false
});

ContractSchema.plugin(timestamps);
// ContractSchema.plugin(mongooseStringQuery);

const ContractLog = mongoose.model('ContractLog', ContractLogSchema);

module.exports = ContractLog;