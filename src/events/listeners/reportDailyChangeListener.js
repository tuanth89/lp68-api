"use strict";

const ReportDailyRepository = require('../../repository/reportDailyRepository');
const log = require('../../../logger').log;
const moment = require('moment');
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * @desc Cập nhật báo cáo hàng ngày
 * @param {Object} data
 * @returns {*|promise}
 */
function updateReportDaily(data) {
    let updateSetReport = {};

    if (data.luuThongTang) {

    }

    if (data.luuThongGiam) {

    }

    if (data.thuVeTang) {

    }

    if (data.thuVeGiam) {

    }

    if (data.chotTang) {

    }

    if (data.chotGiam) {

    }

    if (data.beTang) {

    }

    if (data.beGiam) {

    }

    if (data.daoTang) {

    }

    if (data.daoGiam) {

    }

    ReportDailyRepository.checkExistsAndInsertOrUpdate(updateSetReport)
        .catch(()=> {

        });
}

module.exports = {
    updateReportDaily: updateReportDaily
};