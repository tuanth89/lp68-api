"use strict";

const HdLuuThongOther = require('../models/hdLuuThongOther');
const Q = require("q");
const errors = require('restify-errors');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const config = require('../../config');
const log = require('../../logger').log;

/**
 * @desc Sinh bản ghi lưu thông cho ngày đóng tiền của hợp đồng Thu về, Chốt, Bễ
 * @param {String} contractId
 * @param {Object} data
 * @returns {*|promise}
 */
function insertHdLuuThongByTCB(contractId, data) {
    const deferred = Q.defer();

    let dateCondition = "";
    if (!data.payDate) {
        log.error(new errors.InvalidContentError("Chưa nhập tham số ngày báo cáo"));
        return deferred.promise;
    }

    dateCondition = moment(data.payDate, "YYYY-MM-DD");

    let query = [
        {
            $project: {
                _id: 1,
                moneyPaid: 1,
                contractId: 1,
                createdAt: 1,
                day: {"$dayOfMonth": "$createdAt"},
                month: {"$month": "$createdAt"},
                year: {"$year": "$createdAt"},
            }
        },
        {
            $match: {
                contractId: ObjectId(contractId),
                month: dateCondition.month() + 1,
                day: dateCondition.date(),
                year: dateCondition.year()
            }
        }
    ];

    HdLuuThongOther.aggregate(query).exec(function (err, items) {
        if (err) {
            deferred.reject(new errors.InvalidContentError(err.message));
        } else {
            if (items.length > 0) {
                let [luuThongItem] = items;
                let luuThongUpdateSet = {};

                if (data.newPayMoney)
                    luuThongUpdateSet.moneyPaid = data.newPayMoney === undefined ? 0 : parseInt(data.newPayMoney) + luuThongItem.moneyPaid;

                HdLuuThongOther.findOneAndUpdate({
                    _id: luuThongItem._id
                }, {
                    $set: luuThongUpdateSet
                }, function (error, item) {
                    if (error) {
                        // deferred.reject(new errors.InvalidContentError("Not found"));
                        deferred.resolve({});
                    } else {
                        deferred.resolve(item);
                    }
                });
                deferred.resolve(items[0]);
            } else {
                let luuthongList = [];
                let luuthong = new HdLuuThongOther();
                luuthong._id = new ObjectId();
                luuthong.contractId = contractId;
                luuthong.creator = data.creator;
                luuthong.moneyPaid = data.newPayMoney;
                luuthong.createdAt = data.payDate;

                luuthongList.push(luuthong);

                HdLuuThongOther.insertMany(luuthongList, function (error, item) {
                    if (error) {
                        console.log(error);
                        deferred.resolve({});
                    } else {
                        deferred.resolve(item);
                    }
                });
            }
        }
    });

    return deferred.promise;
}

module.exports = {
    insertHdLuuThongByTCB: insertHdLuuThongByTCB
};