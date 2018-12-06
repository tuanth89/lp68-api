"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ContractSchema = new mongoose.Schema({
    contractId: {
        type: ObjectId,
        require: true
    },
    moneyPaid: {
        type: Number
    },
    nextPayDate: {
        type: Date
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

const Contract = mongoose.model('hdLuuThong', ContractSchema);

module.exports = Contract;