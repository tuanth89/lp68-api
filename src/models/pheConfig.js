"use strict";

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
const mongooseStringQuery = require('mongoose-string-query');

const PheConfigSchema = new mongoose.Schema({
    loanMoneyPack: {
        type: Number,
        required: true
    },
    isNewCustomer: {
        type: Boolean
    },
    day: {
        type: Number
    },
    receive: {
        type: Number
    }
}, {
    minimize: false
});

PheConfigSchema.plugin(timestamps);
PheConfigSchema.plugin(mongooseStringQuery);

const PheConfig = mongoose.model('PheConfig', PheConfigSchema);

module.exports = PheConfig;