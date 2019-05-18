"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;

const HdLuuThongOtherSchema = new mongoose.Schema({
    creator: {
        type: ObjectId,
        ref: "User"
    },
    contractId: {
        type: ObjectId,
        ref: "Contract",
        require: true
    },
    moneyPaid: {
        type: Number,
        default: 0
    }
}, {
    minimize: false
});


HdLuuThongOtherSchema.plugin(timestamps);
HdLuuThongOtherSchema.plugin(mongooseStringQuery);

const HdLuuThongOther = mongoose.model('hdLuuThongOther', HdLuuThongOtherSchema);

module.exports = HdLuuThongOther;