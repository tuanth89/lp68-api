"use strict";

const config = require('../../config');
const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const ReportDailySchema = new mongoose.Schema({
        luuThongSLTang: {
            type: Number
        },
        luuThongSLGiam: {
            type: Number
        },
        luuThongMoneyTang: {
            type: Number
        },
        luuThongMoneyGiam: {
            type: Number
        },

        thuVeSLTang: {
            type: Number
        },
        thuVeSLGiam: {
            type: Number
        },
        thuVeMoneyTang: {
            type: Number
        },
        thuVeMoneyGiam: {
            type: Number
        },

        chotSLTang: {
            type: Number
        },
        chotSLGiam: {
            type: Number
        },
        chotMoneyTang: {
            type: Number
        },
        chotMoneyGiam: {
            type: Number
        },

        beSLTang: {
            type: Number
        },
        beSLGiam: {
            type: Number
        },
        beMoneyTang: {
            type: Number
        },
        beMoneyGiam: {
            type: Number
        },

        daoSLTang: {
            type: Number
        },
        daoSLGiam: {
            type: Number
        },
        daoMoneyTang: {
            type: Number
        },
        daoMoneyGiam: {
            type: Number
        }
    }
    , {
        minimize: false
    });

ReportDailySchema.plugin(timestamps);
ReportDailySchema.plugin(mongooseStringQuery);

const ReportDaily = mongoose.model('ReportDaily', ReportDailySchema);

module.exports = ReportDaily;