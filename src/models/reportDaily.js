"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ReportDailySchema = new mongoose.Schema({
        storeId: {
            type: ObjectId,
            ref: "Store",
            required: true
        },
        creator: {
            type: ObjectId,
            ref: "User"
        },
        totalCustomerMaturity: {
            type: Number,
            default: 0
        },
        totalCustomerNew: {
            type: Number,
            default: 0
        },

        luuThongSLTang: {
            type: Number,
            default: 0
        },
        luuThongSLGiam: {
            type: Number,
            default: 0
        },
        luuThongMoneyTang: {
            type: Number,
            default: 0
        },
        luuThongMoneyGiam: {
            type: Number,
            default: 0
        },

        thuVeSLTang: {
            type: Number,
            default: 0
        },
        thuVeSLGiam: {
            type: Number,
            default: 0
        },
        thuVeMoneyTang: {
            type: Number,
            default: 0
        },
        thuVeMoneyGiam: {
            type: Number,
            default: 0
        },

        chotSLTang: {
            type: Number,
            default: 0
        },
        chotSLGiam: {
            type: Number,
            default: 0
        },
        chotMoneyTang: {
            type: Number,
            default: 0
        },
        chotMoneyGiam: {
            type: Number,
            default: 0
        },

        beSLTang: {
            type: Number,
            default: 0
        },
        beSLGiam: {
            type: Number,
            default: 0
        },
        beMoneyTang: {
            type: Number,
            default: 0
        },
        beMoneyGiam: {
            type: Number,
            default: 0
        },

        daoSLTang: {
            type: Number,
            default: 0
        },
        daoSLGiam: {
            type: Number,
            default: 0
        },
        daoMoneyTang: {
            type: Number,
            default: 0
        },
        daoMoneyGiam: {
            type: Number,
            default: 0
        }
    }
    , {
        minimize: false
    });

ReportDailySchema.plugin(timestamps);
ReportDailySchema.plugin(mongooseStringQuery);

const ReportDaily = mongoose.model('ReportDaily', ReportDailySchema);

module.exports = ReportDaily;