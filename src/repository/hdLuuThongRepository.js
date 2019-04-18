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
const CONTRACT_CONST = require('../constant/contractConstant');
const USER_CONSTANT = require('../constant/userConstant');
const config = require('../../config');
const log = require('../../logger').log;

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
        .exec(function (err, luuthong) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else if (!luuthong) {
                deferred.reject(new errors.ResourceNotFoundError('The resource you requested could not be found.'));
            } else {
                deferred.resolve(luuthong);
            }
        });

    return deferred.promise;
}

/**
 * @desc Tìm ngày lưu thông gần nhất với trạng thái đã đóng.
 * @param contractId
 * @returns {*|promise}
 */
function findDateDescByContractId(contractId) {
    const deferred = Q.defer();

    HdLuuThong
        .findOne({
            // _id: {$ne: luuthongCurrentId},
            contractId: contractId
            // status: 1
        })
        .sort({createdAt: -1})
        .exec(function (err, luuthong) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(luuthong);
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
 * @param params
 * @returns {*|promise}
 */
function getListByDate(params) {
    const deferred = Q.defer();

    let page = parseInt(params.page) || config.pagination.page;
    let per_page = parseInt(params.per_page) || config.pagination.limit;
    let offset = (page - 1) * per_page;

    let date = params.date || new Date();
    let status = parseInt(params.status);
    if (status === undefined || status === null)
        status = -1;
    let storeId = params.storeId || "";
    let userId = params.userId || "";
    let role = params.roles || [];
    let isRoot = role.indexOf(USER_CONSTANT.ROLE_ROOT) >= 0;

    let dateFilter = new Date(date);

    let dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate(), 0, 0, 0);
    let dateTo = dateFilter.addDays(1);
    dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0);

    let query = [
        {
            $match: {
                createdAt: {
                    $gte: dateFrom,
                    $lt: dateTo
                }
            }
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
                contract: {"$arrayElemAt": ["$contracts", 0]},
                moneyHavePay: 1,
                moneyPaid: 1,
                status: 1,
                createdAt: 1
            }
        }
        , {
            $lookup: {
                from: "customers",
                localField: "contract.customerId",
                foreignField: "_id",
                as: "customers"
            }
        }
        , {
            $project: {
                _id: 1,
                contract: 1,
                customerItem: {"$arrayElemAt": ["$customers", 0]},
                moneyHavePay: 1,
                moneyPaid: 1,
                status: 1,
                createdAt: 1
            }
        }
        , {
            $match: status > -1 ? {
                "contract.status": status
            } : {}
        }
        , {
            $project: {
                _id: 1,
                contractId: "$contract._id",
                contractNo: "$contract.contractNo",
                "customer.name": "$customerItem.name",
                "customer._id": "$customerItem._id",
                customerNameE: "$customerItem.nameE",
                loanMoney: "$contract.loanMoney",
                actuallyCollectedMoney: "$contract.actuallyCollectedMoney",
                loanDate: "$contract.loanDate",
                dailyMoneyPay: "$contract.dailyMoneyPay",
                totalMoneyPaid: "$contract.totalMoneyPaid",
                loanEndDate: "$contract.loanEndDate",
                contractDate: "$contract.createdAt",
                contractStatus: "$contract.status",
                storeId: "$contract.storeId",
                creator: "$contract.creator",
                contractCreatedAt: "$contract.createdAt",
                noIdentity: "$contract.noIdentity",
                moneyHavePay: 1,
                moneyPaid: 1,
                status: 1,
                createdAt: 1,
                totalHavePay: {$subtract: ["$contract.actuallyCollectedMoney", "$contract.totalMoneyPaid"]},
                moneyByStatusEnd: {
                    $cond: [{
                        $and: [
                            {
                                $eq: ["$status", CONTRACT_OTHER_CONST.STATUS.COMPLETED]
                            }
                        ]
                    },
                        "$moneyPaid", 0
                    ]
                }
            }
        }
    ];

    if (storeId && !isRoot) {
        query.push({$match: {storeId: ObjectId(storeId)}});
    }

    if (userId && !isRoot) {
        query.push({$match: {creator: ObjectId(userId)}});
    }

    query.push({$sort: {"customerNameE": 1, noIdentity: -1}});

    let pageIndex = [
        {
            $group: {
                _id: null,
                totalItems: {
                    $sum: 1
                },
                totalMoneyStatusEnd: {
                    $sum: "$moneyByStatusEnd"
                },
                docs: {
                    $push: '$$ROOT'
                }
            }
        },
        {
            $project: {
                totalItems: 1,
                totalMoneyStatusEnd: 1,
                docs: {
                    $slice: ["$docs", offset, per_page]
                }
            }
        }
    ];

    query.push(...pageIndex);

    HdLuuThong
        .aggregate(query)
        // .select(Serializer.summary)
        .exec(function (error, contracts) {
            if (error) {
                console.log(error);
                deferred.reject(new errors.InvalidContentError(error.message));
            } else {
                deferred.resolve(contracts[0]);
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
 * Thêm mới hàng loạt theo contracts
 * @param data
 * @returns {*|promise}
 */
function insertMany(data) {
    const deferred = Q.defer();

    let luuthongList = [];

    data.forEach((contractItem) => {
        // let count = 1; // Khách vay đóng luôn vài ngày

        // let nextPayDate = new Date(contractItem.createdAt);
        // nextPayDate.setDate(nextPayDate.getDate() + 1);

        let nextPayDate = moment(contractItem.createdAt, "YYYY-MM-DD");
        if (contractItem.dateEnd) {
            nextPayDate = moment(contractItem.dateEnd, "DD/MM/YYYY");
        }
        nextPayDate.add(1, "days");

        let totalMoneyPaid = contractItem.totalMoneyPaid || 0;
        let luuthong = new HdLuuThong();
        luuthong.contractId = contractItem.contractId;
        luuthong.creator = contractItem.creator;

        if (contractItem.status === CONTRACT_CONST.STAND) {
            luuthong.moneyHavePay = contractItem.dailyMoneyPay;
            luuthong.moneyPaid = 0;
        }
        else {
            if (totalMoneyPaid > 0) {
                luuthong.moneyHavePay = contractItem.dailyMoneyPay;
                luuthong.moneyPaid = contractItem.moneyPaid;
            } else {
                luuthong.moneyHavePay = contractItem.dailyMoneyPay;
                luuthong.moneyPaid = contractItem.dailyMoneyPay;
            }
        }

        // Nếu là tạo hợp đồng vay mới
        if (contractItem.createContractNew) {
            // Tính luôn lưu thông của ngày tạo hợp đồng mới
            let luuthongCurrent = new HdLuuThong();
            luuthongCurrent.contractId = contractItem.contractId;
            luuthongCurrent.creator = contractItem.creator;
            if (contractItem.dateEnd) {
                luuthongCurrent.createdAt = moment(contractItem.dateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");
            }
            else
                luuthongCurrent.createdAt = contractItem.createdAt;
            luuthongCurrent.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;

            let paidMoney = parseInt(contractItem.paidMoney);
            if (paidMoney > 0) {
                luuthongCurrent.moneyPaid = paidMoney;
                luuthongCurrent.moneyHavePay = paidMoney;
            }

            totalMoneyPaid += parseInt(luuthongCurrent.moneyPaid);
            luuthongList.push(luuthongCurrent);

            // Update tổng tiền đã đóng vào hợp đồng
            ContractRepository.updateTotalMoneyPaid(contractItem._id, totalMoneyPaid);
        }

        luuthong.createdAt = nextPayDate.format("YYYY-MM-DD");
        if (contractItem.status === CONTRACT_CONST.STAND
            || contractItem.status === CONTRACT_CONST.NEW
            || contractItem.status === CONTRACT_CONST.MATURITY) {
            luuthongList.push(luuthong);
        }
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
 * Thêm mới hàng loạt theo hơp đồng cũ
 * @param data
 * @returns {*|promise}
 */
function insertManyByContractOld(data) {
    const deferred = Q.defer();

    let luuthongList = [];

    data.forEach((contractItem) => {
        // let nextPayDate = new Date(contractItem.createdAt);
        // nextPayDate.setDate(nextPayDate.getDate() + 1);

        let dateEnd = moment(contractItem.dateEnd, "DD/MM/YYYY");
        let nextPayDate = dateEnd.add(1, "days").format("YYYY-MM-DD");

        let totalMoneyPaid = contractItem.totalMoneyPaid || 0;
        let luuthong = new HdLuuThong();
        luuthong.contractId = contractItem.contractId;
        luuthong.creator = contractItem.creator;

        if (contractItem.status === CONTRACT_CONST.STAND) {

        }
        else {
            if (totalMoneyPaid > 0) {
                luuthong.moneyHavePay = contractItem.moneyHavePay;
                luuthong.moneyPaid = contractItem.moneyPaid;
            } else {
                luuthong.moneyHavePay = contractItem.dailyMoneyPay;
                luuthong.moneyPaid = contractItem.dailyMoneyPay;
            }

            // Nếu là tạo hợp đồng vay mới
            if (contractItem.createContractNew) {
                // Tính luôn lưu thông của hợp đồng theo ngày chốt
                let luuthongCurrent = new HdLuuThong();
                luuthongCurrent.contractId = contractItem.contractId;
                luuthongCurrent.creator = contractItem.creator;
                luuthongCurrent.createdAt = moment(contractItem.dateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");
                luuthongCurrent.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;

                let paidMoney = parseInt(contractItem.paidMoney);
                if (paidMoney > 0) {
                    luuthongCurrent.moneyPaid = paidMoney;
                    luuthongCurrent.moneyHavePay = paidMoney;
                }

                luuthongList.push(luuthongCurrent);
            }
        }

        luuthong.createdAt = nextPayDate;

        if (totalMoneyPaid < contractItem.actuallyCollectedMoney)
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
 * Thêm mới hàng loạt các hdLuuThong list
 * @param data
 * @returns {*|promise}
 */
function saveMany(data) {
    const deferred = Q.defer();

    HdLuuThong.insertMany(data, function (error, item) {
        if (error) {
            console.error(error);
            deferred.reject(
                new errors.InvalidContentError(error.message)
            );
        } else {
            deferred.resolve(true);
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
    let luuthongs = [];
    let dailyMoneyPay = 0, // Số tiền phải đóng hàng ngày (cố định) (tiền lãi, thực thu / số ngày vay)
        // totalMoneyHavePayNow = 0, // Tổng số tiền phải đóng tói thời điểm hiện tại
        totalMoneyPaid = 0; // Tổng số tiền đã đóng tới thời điểm hiện tại

    data.forEach((contractItem) => {
        dailyMoneyPay = contractItem.dailyMoneyPay;
        totalMoneyPaid = contractItem.totalMoneyPaid || 0;
        totalMoneyPaid += contractItem.moneyPaid;

        let contractUpdateSet = {totalMoneyPaid: totalMoneyPaid};

        if (totalMoneyPaid < contractItem.actuallyCollectedMoney) {
            // Tạo bản ghi lưu thông ngày tiếp theo
            let luuthong = new HdLuuThong();
            luuthong.creator = contractItem.creator;
            luuthong.contractId = contractItem.contractId;
            luuthong._doc.totalMoneyPaid = totalMoneyPaid;

            if (contractItem.contractStatus === CONTRACT_CONST.STAND) {
                luuthong._doc.dailyMoneyPay = 0;
                luuthong.moneyHavePay = 0;
                luuthong.moneyPaid = 0;
            }
            else {
                luuthong._doc.dailyMoneyPay = contractItem.dailyMoneyPay;
                luuthong.moneyHavePay = dailyMoneyPay;
                luuthong.moneyPaid = dailyMoneyPay;
            }

            luuthong.createdAt = contractItem.createdAt;
            luuthongs.push(luuthong);
        }
        else // Nếu tiền đóng đủ và hết
            contractUpdateSet.status = CONTRACT_CONST.END;

        bulkHdLuuThong.find({_id: ObjectId(contractItem._id)})
            .update({
                $set: {
                    moneyHavePay: contractItem.moneyHavePay,
                    moneyPaid: contractItem.moneyPaid,
                    status: CONTRACT_OTHER_CONST.STATUS.COMPLETED
                }
            });

        bulkContract.find({_id: ObjectId(contractItem.contractId)})
            .update({$set: contractUpdateSet});
    });


    bulkHdLuuThong.execute(function (error, luuThongs) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            bulkContract.execute(function (error, items) {
                if (error) {
                    deferred.reject(new errors.InvalidContentError(error.message));
                } else {
                    deferred.resolve(luuthongs);
                }
            });
        }
    });

    return deferred.promise;
}


/**
 * @desc chốt lãi đứng
 * @param contractId
 * @param data
 * @returns {*|promise}
 */
function updateChotLaiDung(contractId, data) {
    const deferred = Q.defer();

    // Nếu không chốt đủ tiền thì sinh tiếp bản ghi lưu thông cho ngày tiếp theo
    if (data.totalMoneyPaid > 0) {
        let luuthongList = [];
        let luuthong = new HdLuuThong(data);
        luuthong._id = new ObjectId();
        luuthong.creator = data.creator;
        luuthong.contractId = contractId;
        luuthong.createdAt = (new Date()).addDays(1);
        luuthongList.push(luuthong);

        HdLuuThong.insertMany(luuthongList, function (error, item) {
            if (error) {
                console.error(error);

                deferred.resolve(false);
                return deferred.promise;
            } else {
                deferred.resolve(true);
            }
        });
    }
    else {
        deferred.resolve(true);
    }

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

/**
 *
 * @param contractId
 * @returns {*|promise}
 */
function removeByContractId(contractId) {
    const deferred = Q.defer();

    HdLuuThong.remove({
        contractId: contractId
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

/**
 *
 * @param data
 * @returns {*|promise}
 */
function updateStatus(data) {
    const deferred = Q.defer();
    let luuThongUpdateSet = {
        status: data.luuThongStatus
    };

    if (data.payMoneyOriginal)
        luuThongUpdateSet.moneyPaid = data.payMoneyOriginal === undefined ? 0 : data.payMoneyOriginal;

    HdLuuThong.findOneAndUpdate({
        _id: data.luuThongId
    }, {
        $set: luuThongUpdateSet
    }, function (error, item) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(item);
        }
    });


    return deferred.promise;
}

/**
 * @desc Sinh bản ghi lưu thông tiếp theo sau ngày hiện tại
 * @param {String} contractId
 * @param {Object} data
 * @returns {*|promise}
 */
function insertHdLuuThong(contractId, data) {
    const deferred = Q.defer();

    let luuthongList = [];
    let luuthong = new HdLuuThong(data);
    luuthong._id = new ObjectId();
    luuthong.contractId = contractId;
    luuthong.creator = data.creator;
    if (data.moneyHavePay)
        luuthong.moneyHavePay = data.moneyHavePay;
    if (data.moneyPaid)
        luuthong.moneyPaid = data.moneyPaid;

    if (data.createdAt)
        luuthong.createdAt = moment.utc(data.createdAt, "DD/MM/YYYY").add(1, 'days');

    // // Ngày hẹn
    // if (data.newAppointmentDate)
    //     luuthong.appointmentDate = moment.utc(data.newAppointmentDate, "YYYYMMDD");
    //
    // // Hẹn đóng
    // if (data.newPayMoney)
    //     luuthong.newPayMoney = data.newPayMoney;

    // Ngày chuyển
    if (data.newTransferDate)
        luuthong.transferDate = moment.utc(data.newTransferDate, "YYYYMMDD");

    luuthongList.push(luuthong);
    HdLuuThong.insertMany(luuthongList, function (error, item) {
        if (error) {
            console.error(error);

            deferred.resolve(false);
            return deferred.promise;
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
}

/**
 * Chuyển ở tab nào (Thu ve, Chot, Be) thì update tiền đóng vào ngày lưu thông hôm ấy.
 * Nếu lưu thông k có bản ghi ngày hôm ấy thì tự sinh bản ghi.
 * @param data
 * @returns {*|promise}
 */
function findAndInsertIfNotExists(data) {
    const deferred = Q.defer();
    let dateCondition = moment();
    if (data.newTransferDate)
        dateCondition = moment.utc(data.newTransferDate, "YYYY-MM-DD");

    let query = [
        {
            $project: {
                _id: 1,
                moneyPaid: 1,
                status: 1,
                contractId: 1,
                createdAt: 1,
                day: {"$dayOfMonth": "$createdAt"},
                month: {"$month": "$createdAt"},
                year: {"$year": "$createdAt"},
            }
        },
        {$match: {month: dateCondition.month() + 1, day: dateCondition.date(), year: dateCondition.year()}}
    ];

    HdLuuThong.aggregate(query).exec(function (err, items) {
        if (err) {
            deferred.reject(new errors.InvalidContentError(err.message));
        } else {
            if (items.length > 0)
                deferred.resolve(items[0]);
            else {
                ContractRepository.findById(data.contractId)
                    .then(contractItem => {
                        let luuThongList = [];
                        let hdLuuThongItem = new HdLuuThong();
                        hdLuuThongItem.creator = contractItem.creator;
                        hdLuuThongItem.contractId = data.contractId;
                        hdLuuThongItem.moneyPaid = data.luuthongMoneyPaid;
                        hdLuuThongItem.createdAt = moment(data.newTransferDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                        hdLuuThongItem.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;

                        luuThongList.push(hdLuuThongItem);
                        HdLuuThong.insertMany(luuThongList, function (error, item) {
                            if (error) {
                                deferred.reject(new errors.InvalidContentError(err.message));
                            } else {
                                let luuThong = item[0];
                                luuThong.isNew = true;
                                deferred.resolve(luuThong);
                            }
                        });
                    })
                    .catch(err => {
                        deferred.reject(new errors.InvalidContentError(err.message));
                    });

                // HdLuuThong.insertMany([hdLuuThongItem])(function (error, item) {
                //     if (error) {
                //         deferred.reject(new errors.InvalidContentError(err.message));
                //     } else {
                //         deferred.resolve(item);
                //     }
                // });
            }
        }
    });

    return deferred.promise;
}

/**
 * @desc Sinh bản ghi lưu thông cho ngày đóng tiền của hợp đồng Thu về, Chốt, Bễ
 * @param {String} contractId
 * @param {Object} data
 * @returns {*|promise}
 */
function insertHdLuuThongByTCB(contractId, data) {
    const deferred = Q.defer();

    let dateCondition = moment();
    if (data.payDate)
        dateCondition = moment(data.payDate, "DD/MM/YYYY");

    let query = [
        {
            $project: {
                _id: 1,
                moneyPaid: 1,
                status: 1,
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

    HdLuuThong.aggregate(query).exec(function (err, items) {
        if (err) {
            deferred.reject(new errors.InvalidContentError(err.message));
        } else {
            if (items.length > 0) {
                let [luuThongItem] = items;
                let luuThongUpdateSet = {
                    status: CONTRACT_OTHER_CONST.STATUS.COMPLETED
                };

                if (data.newPayMoney)
                    luuThongUpdateSet.moneyPaid = data.newPayMoney === undefined ? 0 : parseInt(data.newPayMoney) + luuThongItem.moneyPaid;

                HdLuuThong.findOneAndUpdate({
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
            }
            else {
                let luuthongList = [];
                let luuthong = new HdLuuThong();
                luuthong._id = new ObjectId();
                luuthong.contractId = contractId;
                luuthong.creator = data.creator;
                luuthong.moneyHavePay = 0;
                luuthong.moneyPaid = data.newPayMoney;
                luuthong.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;

                if (data.payDate)
                    luuthong.createdAt = moment(data.payDate, "DD/MM/YYYY").format("YYYY-MM-DD");
                else
                    luuthong.createdAt = moment().format("YYYY-MM-DD");

                luuthongList.push(luuthong);

                HdLuuThong.insertMany(luuthongList, function (error, item) {
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
    findById: findById,
    findDateDescByContractId: findDateDescByContractId,
    getList: getList,
    getListByDate: getListByDate,
    update: update,
    save: save,
    remove: remove,
    removeByContractId: removeByContractId,
    insertMany: insertMany,
    insertManyByContractOld: insertManyByContractOld,
    saveMany: saveMany,
    updateMany: updateMany,
    updateChotLaiDung: updateChotLaiDung,
    updateStatus: updateStatus,
    insertHdLuuThong: insertHdLuuThong,
    findAndInsertIfNotExists: findAndInsertIfNotExists,
    insertHdLuuThongByTCB: insertHdLuuThongByTCB

};