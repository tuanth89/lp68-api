"use strict";

const errors = require('restify-errors');
const ContractRepository = require('../repository/contractRepository');
const CustomerRepository = require('../repository/customerRepository');
const AuthorizationService = require('../services/authorizationService');
const EventDispatcher = require('../events/dispatcher');
const _ = require('lodash');

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

    let customerArr = [];
    _.forEach(data, (item) => {
        customerArr.push(item.customer);
    });

    // CustomerRepository.updateBulk(customerArr)
    //     .then((customers) => {
    ContractRepository.insertOrUpdateBulk(data)
        .then(function (contracts) {
            // Sinh các bản ghi lưu thông của ngày tiếp theo phải đóng tiền
            EventDispatcher.newContractAddedListener(contracts);

            // Sinh các bản ghi log lưu vết cho các hợp đồng mới tạo
            EventDispatcher.createContractLogListener(contracts);

            res.send(201, contracts);
            next();
        })
        .catch((error) => {
            return next(error);
        })
        .done();
    // })
    // .catch((error) => {
    //     return next(error);
    // })
    // .done();

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
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateStatus(req, res, next) {
    let data = req.body || {};

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    data.userId = _user.id;

    ContractRepository.updateStatus(req.params.contractId, data)
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
    ContractRepository.remove(req.params.user_id)
        .then(function (deleted) {
            res.send(204);
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
 * @returns {*}
 */
function circulationContract(req, res, next) {
    let data = req.body || {};

    if (data.newLoanMoney <= 0) {
        return next(new errors.InvalidContentError("Số tiền vay không được <= 0"));
    }

    // let _user = AuthorizationService.getUser(req);
    ContractRepository.circulationContract(req.params.contractId, data)
        .then(function (contract) {
            EventDispatcher.updateAndNewLuuThongListener(data._id, contract);
            res.send(201, contract);
            next();
        })
        .catch(function (error) {
            return next(error);
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

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }

    ContractRepository.updateTotalMoneyPaidByUser(req.params.contractId, data.totalMoneyPaid, _user.id)
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
    insertOrUpdateBulk: insertOrUpdateBulk,
    list: list,
    listByDate: listByDate,
    listByType: listByType,
    listByCustomer: listByCustomer,
    one: one,
    update: update,
    remove: remove,
    updateDailyMoneyBulk: updateDailyMoneyBulk,
    circulationContract: circulationContract,
    updateStatus: updateStatus,
    dashboardStatistic: dashboardStatistic,
    updateTotalMoneyPaid: updateTotalMoneyPaid
};
