"use strict";

const errors = require('restify-errors');
const ContractLogRepository = require('../repository/contractLogRepository');
const ContractRepository = require('../repository/contractRepository');
const CustomerRepository = require('../repository/customerRepository');
const HdLuuThongRepository = require('../repository/hdLuuThongRepository');
const CONTRACT_CONTANST = require('../constant/contractConstant');
const CONTRACT_OTHER_CONTANST = require('../constant/contractOtherConstant');
const AuthorizationService = require('../services/authorizationService');
const EventDispatcher = require('../events/dispatcher');
const StringService = require('../services/stringService');
const _ = require('lodash');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function insertOrUpdateBulk(req, res, next) {
    let data = req.body;
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }

    // let customerArr = [];
    // _.forEach(data, (item) => {
    //     customerArr.push(item.customer);
    // });

    // CustomerRepository.updateBulk(customerArr)
    //     .then((customers) => {
    ContractRepository.insertOrUpdateBulk(data)
        .then(function (contracts) {
            //Kiểm tra số hợp đồng có bị trùng lặp
            EventDispatcher.checkContractNoListener(contracts);

            // Sinh các bản ghi lưu thông của ngày tiếp theo phải đóng tiền
            EventDispatcher.newContractAddedListener(contracts);

            // Sinh các bản ghi log lưu vết cho các hợp đồng mới tạo
            EventDispatcher.createContractLogListener(contracts);

            res.send(201, data);
            next();
            // })
            // .catch((error) => {
            //     return next(error);
            // })
            // .done();
            // })
        })
        .catch((error) => {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function insertCusAndContractBulk(req, res, next) {
    let data = req.body;
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }

    CustomerRepository.updateBulk(data)
        .then((customers) => {
            ContractRepository.insertContractNewOrOldBulk(customers)
                .then(function (contracts) {
                    //Kiểm tra số hợp đồng có bị trùng lặp
                    EventDispatcher.checkContractNoListener(contracts);

                    // Sinh các bản ghi lưu thông của ngày tiếp theo phải đóng tiền
                    EventDispatcher.newContractAddedListener(contracts, {luuThongTang: true});

                    let contractList = contracts.slice();
                    _.forEach(contractList, (item) => {
                        if (item.dateEnd)
                            item.createdAt = moment(item.dateEnd, "DD/MM/YYYY").format("YYYY-MM-DD");
                    });
                    /* Report Daily */
                    // let contractTemp = JSON.parse("[{\"_id\":\"5cc490fe0cc46e0a3b189c18\",\"customer\":{\"name\":\"Tuan\",\"_id\":\"5cbd6505faaaaa0bc3cf2817\"},\"customerId\":\"5cbd6505faaaaa0bc3cf2817\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-28\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c18\",\"loanEndDate\":\"2019-05-08\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true},{\"_id\":\"5cc490fe0cc46e0a3b189c1a\",\"customer\":{\"name\":\"GAGA\",\"_id\":\"5cbf415e8575a10b54bc965e\"},\"customerId\":\"5cbf415e8575a10b54bc965e\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-27\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c1a\",\"loanEndDate\":\"2019-05-07\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true},{\"_id\":\"5cc490fe0cc46e0a3b189c1c\",\"customer\":{\"name\":\"GAGA\",\"_id\":\"5cbf415e8575a10b54bc965e\"},\"customerId\":\"5cbf415e8575a10b54bc965e\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-28\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c1c\",\"loanEndDate\":\"2019-05-08\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true}]");
                    EventDispatcher.totalLuuThongTangGiamListener(contractList, true);

                    // Sinh các bản ghi log lưu vết cho các hợp đồng mới tạo
                    EventDispatcher.createContractLogListener(contractList);

                    res.send(201, customers);
                    next();
                })
        })
        .catch((error) => {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function saveManyContractOld(req, res, next) {
    let data = req.body;
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }

    ContractRepository.insertContractOld(data)
        .then(function (contracts) {
            //Kiểm tra số hợp đồng có bị trùng lặp
            EventDispatcher.checkContractNoListener(contracts);

            // Sinh các bản ghi lưu thông của ngày tiếp theo phải đóng tiền
            EventDispatcher.newContractOldAddedListener(contracts);

            // Sinh các bản ghi log lưu vết cho các hợp đồng mới tạo
            // EventDispatcher.createContractLogListener(contracts);

            res.send(201, data);
            next();
        })
        .catch((error) => {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next) {
    ContractRepository.getList(req.params)
        .then(function (contracts) {
            res.send(contracts);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function listByDate(req, res, next) {
    // let date = req.params.date || new Date();
    // let type = req.params.type || -1;
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    req.params.roles = _user.userRoles;

    ContractRepository.getListByDate(req.params)
        .then(function (contracts) {
            res.send(contracts);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * Danh sách hợp đồng mới hoặc cũ
 * @param req
 * @param res
 * @param next
 */
function listNewOrOldByDate(req, res, next) {
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    req.params.roles = _user.userRoles;

    ContractRepository.getListNewOrOldByDate(req.params)
        .then(function (contracts) {
            res.send(contracts);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function listByCustomer(req, res, next) {
    let customerId = req.params.customerId || 0;
    Promise.all([
        CustomerRepository.findById(customerId),
        ContractRepository.getListByCustomer(customerId),
    ])
        .then(function (results) {
            res.send(results);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
    // ContractRepository.getListByCustomer(customerId)
    //     .then(function (contracts) {
    //         res.send(contracts);
    //         next();
    //     })
    //     .catch(function (error) {
    //         return next(error);
    //     })
    //     .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function listByType(req, res, next) {
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    req.params.roles = _user.userRoles;

    ContractRepository.getListByType(req.params)
        .then(function (contracts) {
            res.send(contracts);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function one(req, res, next) {
    ContractRepository.findById(req.params.contractId)
        .then(function (contract) {
            res.send(contract);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done()
    ;
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function update(req, res, next) {
    let data = req.body || {};

    // let _user = AuthorizationService.getUser(req);
    ContractRepository.update(data._id, data)
        .then(function () {
            res.send(200);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * Dành cho kế toán Duyệt sang Hết họ
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateStatusEnd(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId || "";

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    data.userId = _user.id;
    data.luuThongStatus = CONTRACT_OTHER_CONTANST.STATUS.COMPLETED;
    data.contractId = contractId;

    // Nếu kế toán duyệt để chuyển hết họ
    if (data.status === CONTRACT_CONTANST.ACCOUNTANT_END) {
        ContractRepository.updateStatus(contractId, data)
            .then(function () {
                if (data.status === CONTRACT_CONTANST.ACCOUNTANT_END)
                    EventDispatcher.updatePheForStaffListener(contractId);

                res.send(200);
                next();
            })
            .catch(function (error) {
                return next(error);
            })
            .done();
    } else {
        HdLuuThongRepository.updateStatus(data)
            .then(() => {
                EventDispatcher.updateContractTotalMoneyPaidListener(data);

                ContractRepository.updateStatus(contractId, data)
                    .then(function () {
                        res.send(200);
                        next();
                    })
            })
            .catch(function (error) {
                return next(error);
            })
            .done();
    }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateDailyMoneyBulk(req, res, next) {
    let data = req.body || {};

    // let _user = AuthorizationService.getUser(req);
    ContractRepository.updateDailyMoneyBulk(data)
        .then(function () {
            res.send(200);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
    // let _user = req.user;

    let contractId = req.params.contractId;

    ContractRepository.checkContractToDel(contractId)
        .then((contract) => {
            if (!contract) {
                ContractRepository.remove(contractId)
                    .then(function (deleted) {
                        EventDispatcher.removeAllByContractListener(contractId);
                        res.send(200, {removed: true});
                        next();
                    });
            } else {
                res.send(200, {removed: false});
                next();
            }
        })
        .catch(function (error) {
            return next(error);
        })
        .done();

}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function circulationContract(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId || "";

    if (data.newLoanMoney <= 0) {
        return next(new errors.InvalidContentError("Số tiền vay không được <= 0"));
    }

    ContractRepository.circulationContract(contractId, data)
        .then(function (contract) {
            //Kiểm tra số hợp đồng có bị trùng lặp
            EventDispatcher.checkContractNoListener([contract]);

            EventDispatcher.updateAndNewLuuThongListener(data._id, contract);

            // Sinh phế nhân viên cho hợp đồng cũ
            EventDispatcher.updatePheForStaffListener(contractId);

            /* Báo cáo ngày đáo tăng giảm */
            let reportItem = {createdAt: contract.createdAt, totalCustomerMaturity: 1};
            let moneyPayNew = contract.moneyPayNew === undefined ? 0 : parseInt(contract.moneyPayNew);
            if (contract.isGreaterThanOld) {
                reportItem.daoSLTang = 1;
                reportItem.daoMoneyTang = moneyPayNew;
            } else {
                reportItem.daoSLGiam = 1;
                reportItem.daoMoneyGiam = moneyPayNew;
            }

            EventDispatcher.daoTangGiamReportDailyListener(reportItem);

            let dataContractLog = {
                contractId: ObjectId(contractId),
                customerId: ObjectId(data.customer._id),
                createdAt: data.createdAt,
                moneyPayOld: data.moneyPayOld,
                moneyPayNew: data.moneyPayNew,
                contractNewId: contract._id
                // dailyMoneyPay: contract.dailyMoneyPay
            };
            EventDispatcher.insertOrUpdateBulkContractLogListener(dataContractLog);

            res.send(201, contract);
            next();

            // ContractLogRepository.findByContractId(contractId)
            //     .then((contractLog) => {
            //         let contractLogs = [];
            //         let contractLogItem = {
            //             histories: contractLog ? contractLog.histories : [],
            //             contractId: ObjectId(contractId),
            //             customerId: ObjectId(data.customer._id),
            //             createdAt: new Date(data.createdAt)
            //         };
            //         let history = {};
            //         history.title = "Đáo hạn";
            //         history.start = moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss.000").toString() + 'Z';
            //         history.stick = true;
            //         contractLogItem.histories.push(history);
            //         contractLogs.push(contractLogItem);
            //
            //         let contractNewLogItem = Object.assign({}, contractLogItem);
            //         contractNewLogItem.contractId = contract._id;
            //         contractNewLogItem.histories = [];
            //         contractNewLogItem.createdAt = new Date();
            //         let moneyPaid = contract.dailyMoneyPay !== undefined ? StringService.formatNumeric(parseInt(contract.dailyMoneyPay)) : 0;
            //         let historyNew = {};
            //         historyNew.title = "Đóng " + moneyPaid;
            //         historyNew.start = moment(contractNewLogItem.createdAt).format("YYYY-MM-DD HH:mm:ss.000").toString() + 'Z';
            //         historyNew.stick = true;
            //         contractNewLogItem.histories.push(historyNew);
            //         contractLogs.push(contractNewLogItem);
            //
            //         // Sinh các bản ghi log vào lịch
            //         EventDispatcher.insertOrUpdateBulkContractLogListener(contractLogs);
            //
            //         res.send(201, contract);
            //         next();
            //     });

        })
        .catch(err => {
            return next(err);
        })
        .done();
}

/**
 * @desc Thống kê cho màn hình dashboard
 * @param req
 * @param res
 * @param next
 */
function dashboardStatistic(req, res, next) {
    ContractRepository.getDashboardStatistic()
        .then(function (result) {
            res.send(result[0]);
            next();
        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done();
}

/**
 * Cập nhật tổng tiền khách hàng đã đóng
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateTotalMoneyPaid(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId || "";

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }

    ContractRepository.updateTotalMoneyPaidByUser(contractId, data.totalMoneyPaid, _user.id)
        .then(function (result) {
            res.send(200);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * Danh sách các hợp đồng được quản lý bởi nhân viên
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function listCommisionFeeStaff(req, res, next) {
    ContractRepository.getListCommissionFeeStaff(req.params)
        .then(function (contracts) {
            res.send(contracts);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * Cập nhật số tiền phế của nhân viên (kế toán sửa)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateMoneyFeeStaff(req, res, next) {
    let data = req.body || {};

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    data.lastUserUpdate = _user.id;
    data.lastUserNameUpdate = _user.fullName;

    ContractRepository.updateMoneyFeeStaff(req.params, data)
        .then(function () {
            res.send(200);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

module.exports = {
    insertCusAndContractBulk: insertCusAndContractBulk,
    insertOrUpdateBulk: insertOrUpdateBulk,
    saveManyContractOld: saveManyContractOld,
    list: list,
    listByDate: listByDate,
    listByType: listByType,
    listByCustomer: listByCustomer,
    one: one,
    update: update,
    remove: remove,
    updateDailyMoneyBulk: updateDailyMoneyBulk,
    circulationContract: circulationContract,
    updateStatusEnd: updateStatusEnd,
    dashboardStatistic: dashboardStatistic,
    updateTotalMoneyPaid: updateTotalMoneyPaid,
    listCommisionFeeStaff: listCommisionFeeStaff,
    updateMoneyFeeStaff: updateMoneyFeeStaff,
    listNewOrOldByDate: listNewOrOldByDate
};
