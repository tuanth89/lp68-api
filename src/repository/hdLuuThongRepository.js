"use strict";

const HdLuuThong = require('../models/hdLuuThong');
const Contract = require('../models/contract');
const ContractRepository = require('../repository/contractRepository');
const Q = require("q");
const errors = require('restify-errors');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const StringService = require('../services/stringService');
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');

/**
 *
 * @param id
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();

    // if (ObjectId.isValid(id)) {
    if (StringService.isObjectId(id)) {
        id = new ObjectId(id);
    }

    HdLuuThong
        .findOne({
            _id: id
        })
        // .select(Serializer.detail)
        .exec(function (err, user) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else if (!user) {
                deferred.reject(new errors.ResourceNotFoundError('The resource you requested could not be found.'));
            } else {
                deferred.resolve(user);
            }
        });

    return deferred.promise;
}

/**
 *
 * @param params
 * @returns {*|promise}
 */
function getList(params) {
    const deferred = Q.defer();

    HdLuuThong
        .apiQuery(params)
        // .select(Serializer.summary)
        .exec(function (error, users) {
            if (error) {
                console.error(error);
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(users);
            }
        });

    return deferred.promise;
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};
/**
 *
 * @param date
 * @param type
 * @returns {*|promise}
 */
function getListByDate(date) {
    const deferred = Q.defer();
    let dateFilter = new Date(date);

    let dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate(), 0, 0, 0);
    let dateTo = dateFilter.addDays(1);
    dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0);
    let conditionFilter = {
        createdAt: {
            $gte: dateFrom,
            $lt: dateTo
        }
    };

    let query = [
        {$match: conditionFilter},
        {
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
                contract: {"$arrayElemAt": ["$contracts", 0]},
                moneyHavePay: 1,
                moneyPaid: 1,
                status: 1,
                createdAt: 1
            }
        },
        {
            $project: {
                _id: 1,
                contractId: "$contract._id",
                contractNo: "$contract.contractNo",
                customer: "$contract.customer",
                loanMoney: "$contract.loanMoney",
                actuallyCollectedMoney: "$contract.actuallyCollectedMoney",
                loanDate: "$contract.loanDate",
                dailyMoneyPay: "$contract.dailyMoneyPay",
                totalMoneyPaid: "$contract.totalMoneyPaid",
                loanEndDate: "$contract.loanEndDate",
                contractDate: "$contract.createdAt",
                contractStatus: "$contract.status",
                moneyHavePay: 1,
                moneyPaid: 1,
                status: 1,
                createdAt: 1,
                totalHavePay: { $subtract: [ "$contract.actuallyCollectedMoney", "$contract.totalMoneyPaid" ] }
            }
        }
    ];

    HdLuuThong
        .aggregate(query)
        // .select(Serializer.summary)
        .exec(function (error, contracts) {
            if (error) {
                console.error(error);
                deferred.reject(new errors.InvalidContentError(error.message));
            } else {
                deferred.resolve(contracts);
            }
        });

    return deferred.promise;
}

/**
 *
 * @param id
 * @param data
 * @returns {*|promise}
 */
function update(id, data) {
    const deferred = Q.defer();

    HdLuuThong.findOneAndUpdate({
        _id: id
    }, data, {
        new: true
    }, function (error, user) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(user);
        }
    });


    return deferred.promise;
}

/**
 *
 * @param data
 * @returns {*|promise}
 */
function save(data) {
    const deferred = Q.defer();

    let luuthong = new HdLuuThong(data);

    luuthong.save(function (error, user) {
        if (error) {
            console.error(error);

            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;

            // deferred.reject(new errors.InternalError(error.message));
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
}

/**
 *
 * @param data
 * @returns {*|promise}
 */
function insertMany(data) {
    const deferred = Q.defer();

    let luuthongList = [];

    data.forEach((contractItem) => {
        let nextPayDate = new Date(contractItem.createdAt);
        nextPayDate.setDate(nextPayDate.getDate() + 1);

        let totalMoneyPaid = contractItem.totalMoneyPaid || 0;
        let luuthong = new HdLuuThong();
        luuthong.contractId = contractItem.contractId;

        if (totalMoneyPaid > 0) {
            luuthong.moneyHavePay = contractItem.moneyHavePay;
            luuthong.moneyPaid = contractItem.moneyPaid;
        } else {
            luuthong.moneyHavePay = contractItem.dailyMoneyPay;
            luuthong.moneyPaid = contractItem.dailyMoneyPay;
        }

        luuthong.createdAt = nextPayDate;
        luuthongList.push(luuthong);
    });

    HdLuuThong.insertMany(luuthongList, function (error, item) {
        if (error) {
            console.error(error);
            deferred.reject(
                new errors.InvalidContentError(error.message)
            );
        } else {
            deferred.resolve(luuthongList);
        }
    });

    return deferred.promise;
}

/**
 *
 * @param data
 * @returns {*|promise}
 */
function updateMany(data) {
    const deferred = Q.defer();

    let bulkContract = Contract.collection.initializeOrderedBulkOp();
    let bulkHdLuuThong = HdLuuThong.collection.initializeOrderedBulkOp();
    let contracts = [];
    let dailyMoneyPay = 0, // Số tiền phải đóng hàng ngày (cố định) (tiền lãi, thực thu / số ngày vay)
        totalMoneyHavePayNow = 0, // Tổng số tiền phải đóng tói thời điểm hiện tại
        totalMoneyPaid = 0; // Tổng số tiền đã đóng tới thời điểm hiện tại

    data.forEach((contractItem) => {
        dailyMoneyPay = contractItem.dailyMoneyPay;
        totalMoneyPaid = contractItem.totalMoneyPaid || 0;

        totalMoneyPaid += contractItem.moneyPaid;

        // let contractDate = moment(contractItem.contractDate);
        // let luuThongDate = moment(contractItem.createdAt);
        // let totalDayNow = moment.duration(luuThongDate.startOf('day').diff(contractDate.startOf('day'))).asDays();
        // totalMoneyHavePayNow = dailyMoneyPay * totalDayNow;
        //
        // // Tính tới thời điểm hiện tại:
        // // Nếu khách nộp nhiều hơn tiền phải đóng hàng ngày thì trừ bớt sang ngày hôm sau
        // if (totalMoneyPaid > totalMoneyHavePayNow) {
        //     dailyMoneyPay = Math.max(0, dailyMoneyPay - (totalMoneyPaid - totalMoneyHavePayNow));
        // }
        //
        // // Nếu số tiền đóng nhỏ hơn số tiền phải đóng thì cộng dần tiền phải đóng ngày tiếp theo
        // else if (totalMoneyPaid < totalMoneyHavePayNow) {
        //     dailyMoneyPay += (totalMoneyHavePayNow - totalMoneyPaid);
        // }

        // Tạo bản ghi lưu thông ngày tiếp theo
        let luuthong = new HdLuuThong();
        // let nextPayDate = new Date(contractItem.createdAt);
        // luuthong.createdAt = nextPayDate.setDate(nextPayDate.getDate() + 1);

        luuthong.contractId = contractItem.contractId;
        luuthong._doc.totalMoneyPaid = totalMoneyPaid;
        luuthong._doc.dailyMoneyPay = contractItem.dailyMoneyPay;
        luuthong.moneyHavePay = dailyMoneyPay;
        luuthong.moneyPaid = dailyMoneyPay;
        luuthong.createdAt = contractItem.createdAt;
        contracts.push(luuthong);

        bulkHdLuuThong.find({_id: ObjectId(contractItem._id)})
            .update({
                $set: {
                    moneyHavePay: contractItem.moneyHavePay,
                    moneyPaid: contractItem.moneyPaid,
                    status: CONTRACT_OTHER_CONST.STATUS.COMPLETED
                }
            });

        bulkContract.find({_id: ObjectId(contractItem.contractId)})
            .update({$set: {totalMoneyPaid: totalMoneyPaid}});
    });


    bulkHdLuuThong.execute(function (error, luuThongs) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            bulkContract.execute(function (error, items) {
                if (error) {
                    deferred.reject(new errors.InvalidContentError(error.message));
                } else {
                    deferred.resolve(contracts);
                }
            });
        }
    });

    return deferred.promise;
}

/**
 *
 * @param id
 * @returns {*|promise}
 */
function remove(id) {
    const deferred = Q.defer();

    HdLuuThong.remove({
        _id: id
    }, function (error) {
        if (error) {
            console.error(error);
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
}

module.exports = {
    findById: findById,
    getList: getList,
    getListByDate: getListByDate,
    update: update,
    save: save,
    remove: remove,
    insertMany: insertMany,
    updateMany: updateMany,

};