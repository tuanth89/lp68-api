"use strict";

const Contract = require('../models/contract');
const Q = require("q");
const errors = require('restify-errors');
const Serializer = require('../serializers/contract');
const uuid = require('uuid');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const StringService = require('../services/stringService');
const CONTRACT_CONST = require('../constant/contractConstant');
const CONTRACT_OTHER_CONTANST = require('../constant/contractOtherConstant');
const USER_CONSTANT = require('../constant/userConstant');

/**
 *
 * @param id
 * @returns {*|promise}
 */
function findById(id) {
    const deferred = Q.defer();

    if (StringService.isObjectId(id)) {
        id = new ObjectId(id);
    }

    Contract
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

    Contract
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
    let date = params.date || new Date();
    let type = params.type || -1;
    let storeId = params.storeId || "";
    let role = params.roles || [];

    const deferred = Q.defer();
    let dateFilter = new Date(date);
    let dateFrom = "";
    let dateTo = "";

    let query = {};
    switch (parseInt(type)) {
        case CONTRACT_CONST.NEW: // Khách mới
            dateFrom = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate());
            dateTo = dateFilter.addDays(1);
            dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());

            query = {status: CONTRACT_CONST.NEW, createdAt: {$gte: dateFrom, $lt: dateTo}};
            break;
        default: // Lưu thông
            dateFilter.addDays(1);
            query = {status: CONTRACT_CONST.NEW, createdAt: {$lt: dateFilter}};
            break;
    }

    if (storeId && role.indexOf(USER_CONSTANT.ROLE_ROOT) < 0) {
        query = Object.assign({}, query, {storeId: ObjectId(storeId)});
    }

    Contract
        .find(query)
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
 * @param params
 * @returns {*|promise}
 */
function getListByType(params) {
    const deferred = Q.defer();
    let type = params.type || -1;
    let storeId = params.storeId || "";
    let userId = params.userId || "";
    let role = params.roles;
    let isRoot = role.indexOf(USER_CONSTANT.ROLE_ROOT) >= 0;

    let query = {};
    switch (parseInt(type)) {
        case CONTRACT_CONST.MATURITY:
            query = {status: CONTRACT_CONST.MATURITY};
            break;
        case CONTRACT_CONST.COLLECT:
            query = {status: CONTRACT_CONST.COLLECT};
            break;
        case CONTRACT_CONST.CLOSE_DEAL:
            query = {status: CONTRACT_CONST.CLOSE_DEAL};
            break;
        case CONTRACT_CONST.ESCAPE:
            query = {status: CONTRACT_CONST.ESCAPE};
            break;
        case CONTRACT_CONST.STAND:
            query = {status: CONTRACT_CONST.STAND};
            break;
        case CONTRACT_CONST.END:
            query = {
                $or: [{
                    status: CONTRACT_CONST.END
                }, {
                    status: CONTRACT_CONST.MATURITY_END
                }]
            };
            break;
        case CONTRACT_CONST.ACCOUNTANT_END:
            query = {status: CONTRACT_CONST.ACCOUNTANT_END};
            break;
        default:
            query = {status: -1};
            break;
    }

    if (storeId && !isRoot) {
        query.storeId = ObjectId(storeId);
    }

    if (userId && !isRoot) {
        query.creator = ObjectId(userId);
    }

    Contract
        .find(query)
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
 * @param customerId
 * @returns {*|promise}
 */
function getListByCustomer(customerId) {
    const deferred = Q.defer();

    Contract
        .find({"customerId": ObjectId(customerId)})
        .select(Serializer.list)
        .exec(function (error, contracts) {
            if (error) {
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

    Contract.findOneAndUpdate({
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
 * @param id
 * @param data
 * @returns {*|promise}
 */
function updateStatus(id, data) {
    const deferred = Q.defer();

    Contract.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            status: data.status,
            transferDate: moment.utc(new Date(), "YYYYMMDD"),
            lastUserUpdate: data.userId
        }
    }, function (error, contract) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(contract);
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
function updateStatusTransferDate(id, data) {
    const deferred = Q.defer();
    let contractItem = {
        status: data.contractStatus
        // transferDate: moment.utc(new Date(), "YYYYMMDD")
    };

    // Ngày chuyển
    if (data.newTransferDate)
        contractItem.transferDate = moment(data.newTransferDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    // contractItem.transferDate = new Date(data.newTransferDate);

    // Ngày hẹn
    if (data.newAppointmentDate)
        contractItem.appointmentDate = moment(data.newAppointmentDate, "DD/MM/YYYY").format("YYYY-MM-DD");

    // Hẹn đóng
    if (data.payMoney > 0) {
        contractItem.payMoney = data.payMoney;
    }

    Contract.findOneAndUpdate({
        _id: id
    }, {
        $set: contractItem
    }, function (error, contract) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(contract);
        }
    });


    return deferred.promise;
}

/**
 * Tạo mới hoặc Cập nhật số lượng lớn dữ liệu.
 * @param {Array} contracts
 */
function insertOrUpdateBulk(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeOrderedBulkOp();

    _.each(contracts, function (contract) {
        if (!contract._id) {
            contract._id = new ObjectId();
            // contract.createdAt = new Date();
            // contract.creator = ObjectId(creatorId);
        }
        else {
            contract.createdAt = new Date(contract.createdAt);
            contract._id = ObjectId(contract._id);
            contract.updatedAt = new Date();
        }

        // Mã cửa hàng/mã nv/số ngày vay/XM(XĐ)/STT
        // if (!contract.contractNo) {
        // let nowDate = new Date();
        // contract.contractNo = `${nowDate.getFullYear().toString().substr(-2)}${++count}`;
        // contract.noIdentity = count;
        // }

        contract.typeCode = CONTRACT_OTHER_CONTANST.TYPE_CODE.XUAT_MOI;
        contract.contractId = contract._id;

        let startDate = new Date(contract.createdAt);
        contract.loanEndDate = new Date(startDate.setDate(startDate.getDate() + contract.loanDate));

        let dailyMoney = contract.actuallyCollectedMoney / (contract.loanDate === 0 ? 1 : contract.loanDate);
        contract.dailyMoneyPay = dailyMoney.toFixed();

        // if (contract.loanDate > 0) {
        //     let dailyMoney = contract.actuallyCollectedMoney / contract.loanDate;
        //     // contract.dailyMoney = Math.round(dailyMoney * 100) / 100;
        //     contract.dailyMoney = dailyMoney.toFixed();
        // }

        if (contract.isHdLaiDung) {
            contract.status = CONTRACT_CONST.STAND;
            contract.dailyMoneyPay = 0;
        }
        else {
            // Nếu là hợp đồng vay mới thì tính luôn lưu thông cho ngày đó và sinh bản ghi cho ngày tiếp theo
            contract.createContractNew = true;
        }

        if (contract.customer) {
            contract.customer._id = ObjectId(contract.customer._id);
        }

        let item = new Contract(contract);

        bulk.find({_id: ObjectId(item._id)})
            .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(item);

    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contracts);
        }
    });

    return deferred.promise;
}

function generateContract(contractId, storeCode, customerCode) {
    const deferred = Q.defer();

    countByContractNo(contractId, storeCode, customerCode)
        .then((count) => {
            // if (count > 0) {
            deferred.resolve(count + 1);
            // } else {
            //     deferred.resolve(1);
            // }
        })
        .catch((error) => {
            deferred.reject(error);
        }).done();

    return deferred.promise;
}

function countByContractNo(contractId, storeCode, customerCode) {
    const deferred = Q.defer();

    Contract.count({
        _id: {$ne: contractId},
        storeCode: storeCode,
        customerCode: customerCode
    }, function (error, count) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(count);
        }
    });

    return deferred.promise;
}

/**
 * Thêm mới hợp đồng cũ
 * @param {Array} contracts
 */
function insertContractOld(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeOrderedBulkOp();

    _.each(contracts, function (contract) {
        if (!contract._id) {
            contract._id = new ObjectId();
        }

        contract.contractId = contract._id;
        contract.createdAt = moment(contract.createdAt, "DD/MM/YYYY").format("YYYY-MM-DD");
        contract.loanEndDate = moment(contract.createdAt, "YYYY-MM-DD").add(contract.loanDate, "days").format("YYYY-MM-DD");

        let dailyMoney = contract.actuallyCollectedMoney / (contract.loanDate === 0 ? 1 : contract.loanDate);
        contract.dailyMoneyPay = dailyMoney.toFixed();

        contract.typeCode = CONTRACT_OTHER_CONTANST.TYPE_CODE.XUAT_MOI;
        if (contract.isHdDao) {
            contract.status = CONTRACT_CONST.MATURITY;
            contract.typeCode = CONTRACT_OTHER_CONTANST.TYPE_CODE.XUAT_DAO;
            contract.transferDate = moment(contract.dateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");
        }

        if (contract.isHdLaiDung) {
            contract.status = CONTRACT_CONST.STAND;
            contract.dailyMoneyPay = 0;
            contract.transferDate = moment(contract.dateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");
        }
        else {
            // Nếu là hợp đồng vay mới thì tính luôn lưu thông cho ngày đó và sinh bản ghi cho ngày tiếp theo
            contract.createContractNew = true;
        }

        if (contract.customer) {
            contract.customer._id = ObjectId(contract.customer._id);
        }

        let item = new Contract(contract);
        item.totalMoneyPaid = contract.paidMoney;

        bulk.find({_id: ObjectId(item._id)})
            .upsert() // Tạo mới document khi mà không có document nào đúng với tiêu chí tìm kiếm.
            .updateOne(item);
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contracts);
        }
    });

    return deferred.promise;
}

/**
 * Cập nhật tiền đóng hàng ngày.
 * @param {Array} contracts
 */
function updateDailyMoneyBulk(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeOrderedBulkOp();

    _.each(contracts, function (contract) {
        bulk.find({_id: ObjectId(contract._id)})
            .update({$set: {dailyMoney: contract.dailyMoney, dailyMoneyPick: contract.dailyMoneyPick}});
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contracts);
        }
    });

    return deferred.promise;
}

/**
 * Cập nhật tổng tiền đóng hàng ngày dạng array.
 * @param {Array} contracts
 */
function updateTotalMoney(contracts) {
    const deferred = Q.defer();

    let bulk = Contract.collection.initializeOrderedBulkOp();

    _.each(contracts, function (contract) {
        bulk.find({_id: ObjectId(contract._id)})
            .update({$set: {totalMoneyPaid: contract.totalMoneyPaid}});
    });

    bulk.execute(function (error, results) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contracts);
        }
    });

    return deferred.promise;
}

/**
 * Cập nhật tổng tiền đóng hàng ngày bởi Id
 * @param {String} contractId
 * @param {int} totalMoneyPaid
 */
function updateTotalMoneyPaid(contractId, totalMoneyPaid) {
    const deferred = Q.defer();

    Contract.update({
        _id: contractId
    }, {
        $set: {
            totalMoneyPaid: totalMoneyPaid
        }
    }, function (error, contract) {
        if (error) {
            deferred.reject(new errors.InvalidContentError("Not found"));
            return deferred.promise;
        } else {
            deferred.resolve(contract);
        }
    });


    return deferred.promise;
}

/**
 * Cập nhật tổng tiền đóng hàng ngày bởi Id
 * @param {String} contractId
 * @param {int} totalMoneyPaid
 * @param {String} lastUserUpdate
 */
function updateTotalMoneyPaidByUser(contractId, totalMoneyPaid, lastUserUpdate) {
    const deferred = Q.defer();

    Contract
        .findOne({
            _id: contractId
        })
        .exec(function (err, contract) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                let totalMoney = contract.totalMoneyPaid + totalMoneyPaid;
                let updateSet = {
                    totalMoneyPaid: totalMoney,
                    lastUserUpdate: lastUserUpdate
                };

                if (totalMoney < contract.actuallyCollectedMoney) {
                    updateSet.status = CONTRACT_CONST.END;
                }

                Contract.update({
                    _id: contractId
                }, {
                    $set: updateSet
                }, function (error, contract) {
                    if (error) {
                        deferred.reject(new errors.InvalidContentError("Not found"));
                        return deferred.promise;
                    } else {
                        deferred.resolve(contract);
                    }
                });
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

    let contract = new Contract(data);

    contract.save(function (error, user) {
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
 * @param id
 * @returns {*|promise}
 */
function remove(id) {
    const deferred = Q.defer();

    Contract.remove({
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
 * Đáo hợp đồng
 * @param contractId
 * @param data
 * @returns {*|promise}
 */
function circulationContract(contractId, data) {
    const deferred = Q.defer();
    let newLoanMoney = parseInt(data.newLoanMoney) || 0;
    let newActuallyCollectedMoney = parseInt(data.newActuallyCollectedMoney) || 0;
    let newDailyMoney = parseInt(data.newDailyMoney) || 0;
    // let totalMoney = parseInt(data.totalMoney) || 0;
    let newLoanDate = parseInt(data.newLoanDate) || 0;

    Contract.findOne({_id: contractId})
        .exec(function (error, contractItem) {
                // let nowDate = new Date();

                let contractNew = new Contract();
                contractNew.customer = data.customer;
                contractNew.customerId = contractItem.customerId;
                contractNew.createdAt = data.createdAt;
                contractNew.loanMoney = newLoanMoney;
                contractNew.actuallyCollectedMoney = newActuallyCollectedMoney;
                contractNew.loanDate = newLoanDate;
                contractNew.contractHistory = [];
                contractNew.contractHistory.push(contractId);

                contractNew.typeCode = CONTRACT_OTHER_CONTANST.TYPE_CODE.XUAT_DAO;
                contractNew.storeCode = contractItem.storeCode;
                contractNew.customerCode = contractItem.customerCode;
                // contractNew.contractNo = `${nowDate.getFullYear()}_${++countIndetity}`;
                // contractNew.noIdentity = countIndetity;

                contractNew.loanEndDate = moment(data.createdAt, "YYYY-MM-DD").add(contractNew.loanDate, "days").format("YYYY-MM-DD");
                contractNew.dailyMoney = newDailyMoney;
                contractNew.dailyMoneyPay = newDailyMoney;
                contractNew.status = CONTRACT_CONST.NEW;
                contractNew.storeId = contractItem.storeId;
                contractNew.creator = contractItem.creator;
                contractNew.isCustomerNew = contractItem.isCustomerNew;
                // contractNew.transferDate = moment(nowDate).format("YYYY-MM-DD");

                contractNew.isDaoHd = true;
                // let dailyMoney = contractNew.actuallyCollectedMoney / (contractNew.loanDate === 0 ? 1 : contractNew.loanDate);
                // contractNew.dailyMoney = dailyMoney.toFixed();

                // let totalPaid = data.totalMoneyPaid + data.moneyPaid;
                // Thay đổi trạng thái hợp đồng cũ là đáo.
                Contract.update({_id: contractId}, {
                    $set: {
                        // totalMoneyPaid: totalPaid,
                        status: CONTRACT_CONST.MATURITY,
                        transferDate: contractNew.createdAt,
                        updatedAt: new Date()
                    }
                }, function (error, user) {
                    if (error) {
                        console.error(error);
                        deferred.reject(new errors.InvalidContentError(error.message));
                    } else {
                        contractNew.save(function (error, item) {
                            if (error) {
                                console.error(error);
                                deferred.reject(new errors.InvalidContentError(error.message));
                            }
                            else {
                                item._doc.dailyMoney = newDailyMoney;
                                deferred.resolve(item);
                            }
                        });

                    }
                });
            }
        );


    return deferred.promise;
}

/**
 * @returns {*|promise}
 */
function getDashboardStatistic() {
    const deferred = Q.defer();
    let now = new Date();
    let dateBefore = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
    let dateAfter = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    let query = [
        {
            $lookup: {
                from: "hdluuthongs",
                localField: "_id",
                foreignField: "contractId",
                as: "hdLuuThongs"
            }
        },
        {
            $project: {
//         "soHDMoi": {
//             "$cond": [
//                 { "$gte": ["$createdAt", ISODate("2019-01-20")] },
//                1,
//                0
//             ]
//         },
                soHDThuong: {
                    "$cond": [
                        {
                            $and: [
                                {"$gt": ["$createdAt", dateBefore]},
                                {"$lt": ["$createdAt", dateAfter]},
                                {"$ne": ["$status", CONTRACT_CONST.STAND]}
                            ]
                        }
                        , 1, 0
                    ]
                },
                soHdLaiDung: {
                    "$cond": [
                        {
                            $and: [
                                {"$gt": ["$createdAt", dateBefore]},
                                {"$lt": ["$createdAt", dateAfter]},
                                {"$eq": ["$status", CONTRACT_CONST.STAND]}
                            ]
                        }
                        , 1, 0
                    ]
                },
                loanMoney: {
                    "$cond": [
                        {
                            $and: [
                                {"$gt": ["$createdAt", dateBefore]},
                                {"$lt": ["$createdAt", dateAfter]}
                            ]
                        }
                        , "$loanMoney", 0
                    ]
                },
                totalMoneyPaid: {
                    "$cond": [
                        {
                            $and: [
                                {"$gt": ["$createdAt", dateBefore]},
                                {"$lt": ["$createdAt", dateAfter]}
                            ]
                        }
                        , "$totalMoneyPaid", 0
                    ]
                },
                totalLuuThong: {
                    "$filter": {
                        "input": "$hdLuuThongs",
                        "as": "hdLuuThong",
                        cond: {
                            $and: [
                                {"$gt": ["$$hdLuuThong.createdAt", dateBefore]},
                                {"$lt": ["$$hdLuuThong.createdAt", dateAfter]},
                                {"$eq": ["$$hdLuuThong.status", CONTRACT_OTHER_CONTANST.STATUS.COMPLETED]}
                            ]
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: null,
                tongChoVay: {$sum: "$loanMoney"},
                tongThucThu: {$sum: {$sum: "$totalLuuThong.moneyPaid"}},
                hdThuong: {$sum: "$soHDThuong"},
                hdLaiDung: {$sum: "$soHdLaiDung"}
            }
        }
    ];

    Contract
        .aggregate(query)
        .exec(function (err, result) {
            if (err) {
                deferred.reject(new errors.InvalidContentError(err.message));
            } else {
                deferred.resolve(result);
            }
        });

    return deferred.promise;
}

/**
 * @desc Kiểm tra khách hàng đã có hợp đồng nào chưa để xóa khách hàng
 * @param customerId
 */
function checkCustomerContractToDel(customerId) {
    const deferred = Q.defer();
    let query = {};
    if (StringService.isObjectId(customerId))
        query = {customerId: customerId};

    Contract.findOne(query, function (error, contract) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contract);
        }
    });

    return deferred.promise;
}

/**
 * @desc Kiểm tra hợp đồng có đáo, .... ==> để xóa hợp đồng
 * @param contractId
 */
function checkContractToDel(contractId) {
    const deferred = Q.defer();
    // let query = {$or: [
    //     {
    //         contractId: contractId,
    //         contractHistory: { "$in" : [ObjectId(contractId)]}
    //     }
    // ]};

    let query = {
        _id: contractId,
        contractHistory: {$exists: true, $ne: []}
    };

    Contract.findOne(query, function (error, contract) {
        if (error) {
            deferred.reject(new errors.InvalidContentError(error.message));
        } else {
            deferred.resolve(contract);
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
    // countByContractNo: countByContractNo,
    insertOrUpdateBulk: insertOrUpdateBulk,
    updateDailyMoneyBulk: updateDailyMoneyBulk,
    circulationContract: circulationContract,
    updateTotalMoney: updateTotalMoney,
    updateTotalMoneyPaid: updateTotalMoneyPaid,
    updateTotalMoneyPaidByUser: updateTotalMoneyPaidByUser,
    getListByType: getListByType,
    updateStatus: updateStatus,
    updateStatusTransferDate: updateStatusTransferDate,
    getListByCustomer: getListByCustomer,
    getDashboardStatistic: getDashboardStatistic,
    checkCustomerContractToDel: checkCustomerContractToDel,
    checkContractToDel: checkContractToDel,
    insertContractOld: insertContractOld,
    generateContract: generateContract

};