"use strict";

const ReportDaily = require('../models/reportDaily');
const Q = require("q");
const errors = require('restify-errors');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const StringService = require('../services/stringService');
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');
const log = require('../../logger').log;


/**
 * @desc Cập nhật báo cáo hằng ngày
 * @param data
 * @returns {*}
 */
function checkExistsAndInsertOrUpdate(data) {
    const deferred = Q.defer();

    let dateCondition = moment();
    if (data.createdAt)
        dateCondition = moment.utc(data.createdAt, "YYYY-MM-DD");

    let query = [
        {
            $project: {
                _id: 1,
                day: {"$dayOfMonth": "$createdAt"},
                month: {"$month": "$createdAt"},
                year: {"$year": "$createdAt"},
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
                    let reportUpdateSet = {};

                    ReportDaily.findOneAndUpdate({
                        _id: reportItem._id
                    }, {
                        $set: reportUpdateSet
                    }, {upsert: true}, function (error, reportDaily) {
                        if (error) {
                            deferred.resolve(false);
                        } else {
                            deferred.resolve(true);
                        }
                    });
                }
                else {
                    let reportDailyItem = new ReportDaily(data);

                    ReportDaily.save(reportDailyItem)
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

module.exports = {
    checkExistsAndInsertOrUpdate: checkExistsAndInsertOrUpdate

};