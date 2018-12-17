"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');

const ContractLogSchema = new mongoose.Schema({
    contractId: {
        type: ObjectId,
        required: true,
        unique: true
    },
    customerId: {
        type: ObjectId,
        required: true
    },
    histories: {
        type: Array
    }

    // content: {
    //     type: String,
    //     trim: true
    // },
    // startDate: {
    //     type: Date
    // },
    // endDate: {
    //     type: Date
    // }

}, {
    minimize: false
});

ContractLogSchema.plugin(timestamps);
ContractLogSchema.plugin(mongooseStringQuery);

const ContractLog = mongoose.model('ContractLog', ContractLogSchema);

module.exports = ContractLog;