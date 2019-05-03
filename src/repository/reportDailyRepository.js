"use strict";

const ReportDaily = require('../models/reportDaily');
const HdLuuThong = require('../models/hdLuuThong');
const Contract = require('../models/contract');
const Q = require("q");
const errors = require('restify-errors');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');
const CONTRACT_CONST = require('../constant/contractConstant');
const USER_CONSTANT = require('../constant/userConstant');
const log = require('../../logger').log;

/**
 * @desc Báo cáo theo ngày
 * @param params
 * @returns {*|promise}
 */
function getListByDate(params) {
    const deferred = Q.defer();

    let date = params.date || new Date();
    let storeId = params.storeId || "";
    // let userId = params.userId || "";
    let role = params.roles || [];
    let isRoot = role.indexOf(USER_CONSTANT.ROLE_ROOT) >= 0;

    let dateFilter = new Date(date);

    let dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate(), 0, 0, 0);
    let dateTo = dateFilter.addDays(1);
    dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0);

    let query = {
        createdAt: {
            $gte: dateFrom,
            $lt: dateTo
        }
    };

    if (storeId && !isRoot) {
        query.storeId = ObjectId(storeId);
    }

    ReportDaily
        .findOne(query)
        // .select(Serializer.summary)
        .exec(function (error, reportItem) {
            if (error) {
                console.log(error);
                deferred.reject(new errors.InvalidContentError(error.message));
            } else {
                deferred.resolve(reportItem ? reportItem : {});
            }
        });

    return deferred.promise;
}

/**
 * @desc Cập nhật báo cáo hằng ngày
 * @param data
 * @returns {*}
 */
function checkExistsAndInsertOrUpdate(data) {
    const deferred = Q.defer();

    let dateCondition = "";
    if (data.createdAt)
        dateCondition = moment(data.createdAt, "YYYY-MM-DD");
    else {
        console.error(error);
        deferred.reject(new errors.InvalidContentError("Chưa nhập tham số ngày báo cáo"));
        return;
    }

    let query = [
        {
            $project: {
                _id: 1,
                day: {"$dayOfMonth": "$createdAt"},
                month: {"$month": "$createdAt"},
                year: {"$year": "$createdAt"},
                luuThongSLTang: "$luuThongSLTang",
                luuThongMoneyTang: "$luuThongMoneyTang",
                luuThongSLGiam: "$luuThongSLGiam",
                luuThongMoneyGiam: "$luuThongMoneyGiam",
                thuVeSLTang: "$thuVeSLTang",
                thuVeSLGiam: "$thuVeSLGiam",
                thuVeMoneyTang: "$thuVeMoneyTang",
                thuVeMoneyGiam: "$thuVeMoneyGiam",
                chotSLTang: "$chotSLTang",
                chotSLGiam: "$chotSLGiam",
                chotMoneyTang: "$chotMoneyTang",
                chotMoneyGiam: "$chotMoneyGiam",
                beSLTang: "$beSLTang",
                beSLGiam: "$beSLGiam",
                beMoneyTang: "$beMoneyTang",
                beMoneyGiam: "$beMoneyGiam",
                daoSLTang: "$daoSLTang",
                daoSLGiam: "$daoSLGiam",
                daoMoneyTang: "$daoMoneyTang",
                daoMoneyGiam: "$daoMoneyGiam"
            }
        },
        {$match: {month: dateCondition.month() + 1, day: dateCondition.date(), year: dateCondition.year()}}
    ];

    ReportDaily
        .aggregate(query)
        .exec(function (err, items) {
            if (err) {
                log.error(err);
                deferred.reject(false);
            } else {
                if (items.length > 0) {
                    let [reportItem] = items;
                    assignReportDaily(data, reportItem);

                    ReportDaily.findOneAndUpdate({
                        _id: reportItem._id
                    }, {
                        $set: reportItem
                    }, {upsert: true}, function (error, reportDaily) {
                        if (error) {
                            deferred.resolve(false);
                        } else {
                            deferred.resolve(true);
                        }
                    });
                } else {
                    let reportDailyItem = new ReportDaily();
                    assignReportDaily(data, reportDailyItem);

                    reportDailyItem.storeId = data.storeId;
                    reportDailyItem.createdAt = data.createdAt;

                    reportDailyItem.save(reportDailyItem)
                        .then(reportDaily => {
                            deferred.resolve(true);
                        })
                        .catch(err => {
                            log.error(err);
                            deferred.reject(false);
                        });
                }
            }
        });

    return deferred.promise;
}

function assignReportDaily(data, reportItem) {
    reportItem.luuThongSLTang += data.luuThongSLTang ? data.luuThongSLTang : 0;
    reportItem.luuThongSLGiam += data.luuThongSLGiam ? data.luuThongSLGiam : 0;
    reportItem.luuThongMoneyTang += data.luuThongMoneyTang ? data.luuThongMoneyTang : 0;
    reportItem.luuThongMoneyGiam += data.luuThongMoneyGiam ? data.luuThongMoneyGiam : 0;
    reportItem.thuVeSLTang += data.thuVeSLTang ? data.thuVeSLTang : 0;
    reportItem.thuVeSLGiam += data.thuVeSLGiam ? data.thuVeSLGiam : 0;
    reportItem.thuVeMoneyTang += data.thuVeMoneyTang ? data.thuVeMoneyTang : 0;
    reportItem.thuVeMoneyGiam += data.thuVeMoneyGiam ? data.thuVeMoneyGiam : 0;
    reportItem.chotSLTang += data.chotSLTang ? data.chotSLTang : 0;
    reportItem.chotSLGiam += data.chotSLGiam ? data.chotSLGiam : 0;
    reportItem.chotMoneyTang += data.chotMoneyTang ? data.chotMoneyTang : 0;
    reportItem.chotMoneyGiam += data.chotMoneyGiam ? data.chotMoneyGiam : 0;
    reportItem.beSLTang += data.beSLTang ? data.beSLTang : 0;
    reportItem.beSLGiam += data.beSLGiam ? data.beSLGiam : 0;
    reportItem.beMoneyTang += data.beMoneyTang ? data.beMoneyTang : 0;
    reportItem.beMoneyGiam += data.beMoneyGiam ? data.beMoneyGiam : 0;
    reportItem.daoSLTang += data.daoSLTang ? data.daoSLTang : 0;
    reportItem.daoSLGiam += data.daoSLGiam ? data.daoSLGiam : 0;
    reportItem.daoMoneyTang += data.daoMoneyTang ? data.daoMoneyTang : 0;
    reportItem.daoMoneyGiam += data.daoMoneyGiam ? data.daoMoneyGiam : 0;
    reportItem.totalCustomerMaturity += data.totalCustomerMaturity ? data.totalCustomerMaturity : 0;
    reportItem.totalCustomerNew += data.totalCustomerNew ? data.totalCustomerNew : 0;

    return reportItem;
}

/**
 * @desc Tổng khách lưu thông theo ngày
 * @param {Object} params
 * @returns {*|promise}
 */
function totalCusLuuThongByDate(params) {
    const deferred = Q.defer();

    let date = params.date || new Date();
    let storeId = params.storeId || "";
    let dateFilter = new Date(date);
    let dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate(), 0, 0, 0);
    let dateTo = dateFilter.addDays(1);
    dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0);

    let matchCond = {
        createdAt: {
            $gte: dateFrom,
            $lt: dateTo
        }
    };
    if (storeId) {
        matchCond.storeId = ObjectId(storeId);
    }

    let query = [
        {
            $match: matchCond
        }
        , {
            $lookup: {
                from: "contracts",
                localField: "contractId",
                foreignField: "_id",
                as: "contracts"
            }
        }
        , {
            $project: {
                _id: 1,
                contract: {"$arrayElemAt": ["$contracts", 0]}
            }
        }
        , {
            $project: {
                _id: 1,
                customerLuuThong: {
                    $cond: [
                        {$eq: ["$contract.status", CONTRACT_CONST.NEW]}
                        , 1, 0
                    ]
                }
            }
        }
        , {
            $group: {
                _id: null,
                totalCustomerLuuThong: {$sum: "$customerLuuThong"}
            }
        }
    ];

    HdLuuThong.aggregate(query).exec(function (err, item) {
        if (err) {
            deferred.reject(new errors.InvalidContentError(err.message));
        } else {
            deferred.resolve(item.length > 0 ? item[0]: {});
        }
    });

    return deferred.promise;
}

/**
 * @desc Tổng khách thu ve, chot, be
 * @param {Object} params
 * @returns {*|promise}
 */
function totalCusThuVeChotBeByDate(params) {
    const deferred = Q.defer();

    let date = params.date || new Date();
    let storeId = params.storeId || "";
    let dateFilter = new Date(date);
    let dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate(), 0, 0, 0);
    let dateTo = dateFilter.addDays(1);
    dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0);

    let matchCond = {
        createdAt: {
            $gte: dateFrom,
            $lt: dateTo
        }
    };
    if (storeId) {
        matchCond.storeId = ObjectId(storeId);
    }

    let query = [
        {
            $match: matchCond
        }
        , {
            $project: {
                _id: 1,
                customerCollect: {
                    $cond: [
                        {$eq: ["$status", CONTRACT_CONST.COLLECT]}
                        , 1, 0
                    ]
                },
                customerCloseDeal: {
                    $cond: [
                        {$eq: ["$status", CONTRACT_CONST.CLOSE_DEAL]}
                        , 1, 0
                    ]
                },
                customerEscape: {
                    $cond: [
                        {$eq: ["$status", CONTRACT_CONST.ESCAPE]}
                        , 1, 0
                    ]
                }
            }
        }
        , {
            $group: {
                _id: null,
                totalCustomerCollect: {$sum: "$customerCollect"},
                totalCustomerCloseDeal: {$sum: "$customerCloseDeal"},
                totalCustomerEscape: {$sum: "$customerEscape"}
            }
        }
    ];

    Contract.aggregate(query).exec(function (err, item) {
        if (err) {
            deferred.reject(new errors.InvalidContentError(err.message));
        } else {
            deferred.resolve(item.length > 0 ? item[0]: {});
        }
    });

    return deferred.promise;
}

module.exports = {
    getListByDate: getListByDate,
    checkExistsAndInsertOrUpdate: checkExistsAndInsertOrUpdate,
    totalCusLuuThongByDate: totalCusLuuThongByDate,
    totalCusThuVeChotBeByDate: totalCusThuVeChotBeByDate

};