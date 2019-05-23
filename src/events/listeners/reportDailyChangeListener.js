"use strict";

const ReportDailyRepository = require('../../repository/reportDailyRepository');
const log = require('../../../logger').log;
const moment = require('moment');
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

/**
 * @desc Tong so luu thong tang, giảm
 * @param {Object} contracts
 * @param {Boolean} isLuuThongTang : tăng hoặc giảm
 * @returns {*|promise}
 */
function totalLuuThongTangDaily(contracts, isLuuThongTang) {
    if (isLuuThongTang) {
        // _.forEach(contracts, (item) => {
        //     if (item.dateEnd)
        //         item.createdAt = moment(item.dateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");
        // });

        let group = _.groupBy(contracts, 'createdAt');

        let data = _.map(_.keys(group), function (e) {
            return _.reduce(group[e], function (r, o) {
                return r.luuThongMoneyTang += parseInt(o.dailyMoneyPay), r.storeId = o.storeId, r.creator = o.creator, r.totalCustomerNew += (o.isCustomerNew ? 1 : 0), r
            }, {
                createdAt: e,
                luuThongMoneyTang: 0,
                luuThongSLTang: group[e].length,
                storeId: "",
                creator: "",
                totalCustomerNew: 0
            })
        });

        data.forEach(item => {
            ReportDailyRepository.checkExistsAndInsertOrUpdate(item)
                .then(item => {

                })
                .catch((err) => {
                    log.error(err.message);
                })
                .done();
        })
    } else {
        ReportDailyRepository.checkExistsAndInsertOrUpdate(contracts)
            .then(item => {

            })
            .catch((err) => {
                log.error(err.message);
            })
            .done();
    }
}

/**
 * @desc Đáo tăng, giảm
 * @param {Object} contract
 * @returns {*|promise}
 */
function daoTangGiamReportDaily(contract) {
    ReportDailyRepository.checkExistsAndInsertOrUpdate(contract)
        .catch((err) => {
            log.error(err.message);
        })
        .done();
}

module.exports = {
    totalLuuThongTangDaily: totalLuuThongTangDaily,
    daoTangGiamReportDaily: daoTangGiamReportDaily
};