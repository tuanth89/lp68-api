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
    isNewCustomer:{
        type: Boolean
    },
    15: {
        type: Number
    },
    20: {
        type: Number,
    },
    21: {
        type: Number,
    },
    22: {
        type: Number
    },
    24: {
        type: Number
    },
    25: {
        type: Number
    },
    26: {
        type: Number
    },
    27: {
        type: Number
    },
    30: {
        type: Number
    },
    31: {
        type: Number
    },
    32: {
        type: Number
    },
    33: {
        type: Number
    },
    40: {
        type: Number
    },
    41: {
        type: Number
    },
    42: {
        type: Number
    },
    43: {
        type: Number
    },
    44: {
        type: Number
    }
}, {
    minimize: false
});

PheConfigSchema.plugin(timestamps);
PheConfigSchema.plugin(mongooseStringQuery);

const PheConfig = mongoose.model('PheConfig', PheConfigSchema);

module.exports = PheConfig;