"use strict";

const errors = require('restify-errors');
const ContractRepository = require('../repository/contractRepository');
const HdLuuThongRepository = require('../repository/hdLuuThongRepository');
const AuthorizationService = require('../services/authorizationService');
const EventDispatcher = require('../events/dispatcher');
const _ = require('lodash')
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');
const CONTRACT_CONST = require('../constant/contractConstant');


/**
 *
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next) {
    HdLuuThongRepository.getList(req.params)
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
    // let status = parseInt(req.params.status);
    // if (status === undefined || status === null)
    //     status = -1;

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    req.params.roles = _user.userRoles;

    HdLuuThongRepository.getListByDate(req.params)
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
    HdLuuThongRepository.findById(req.params.contractId)
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
    HdLuuThongRepository.update(data._id, data)
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
function updateMany(req, res, next) {
    let data = req.body || {};

    // let _user = AuthorizationService.getUser(req);
    HdLuuThongRepository.updateMany(data)
        .then(function (contracts) {
            // Sinh các bản ghi lưu thông của ngày tiếp theo phải đóng tiền
            EventDispatcher.newContractLuuThongListener(contracts);

            // ghi log lưu vết cho các hợp đồng
            EventDispatcher.addMultiLogToContractLogListener(data);

            res.send(200);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * @desc Chốt lãi hợp đồng
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateChotLai(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId;
    let newPayMoney = parseInt(data.newPayMoney);
    if (newPayMoney <= 0) {
        return next(new errors.InvalidContentError("Số tiền đóng không được <= 0"));
    }
    // let _user = AuthorizationService.getUser(req);

    ContractRepository.findById(contractId)
        .then((contractItem) => {
            let money = contractItem.actuallyCollectedMoney - newPayMoney;
            data.totalMoneyPaid = newPayMoney;

            let dataContract = {
                contractId: contractId,
                luuThongId: data._id,
                contractStatus: money <= 0 ? CONTRACT_CONST.END : -1,
                luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
                totalMoneyPaid: newPayMoney
            };
            EventDispatcher.updateStatusContractAndLuuThongListener(dataContract);

            // if (money > 0) {
            //     HdLuuThongRepository.insertHdLuuThong(contractId, data)
            //         .then(function (contract) {
            //             res.send(201, true);
            //             next();
            //         })
            //         .catch(function (error) {
            //             return next(error);
            //         })
            //         .done();
            // }
            // else {
            res.send(201, true);
            next();
            // }
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * @desc Chuyển sang Thu Về
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateThuVe(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId;
    // let _user = AuthorizationService.getUser(req);

    // ContractRepository.findById(contractId)
    //     .then((contractItem) => {
    let dataContract = {
        contractId: contractId,
        luuThongId: data._id,
        contractStatus: data.statusContract,
        luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED
    };

    EventDispatcher.updateStatusContractAndLuuThongListener(dataContract);

    res.send(201, true);
    next();

    // HdLuuThongRepository.insertHdLuuThong(contractId, data)
    //     .then(function (contract) {
    //         res.send(201, true);
    //         next();
    //     })
    //     .catch(function (error) {
    //         return next(error);
    //     })
    //     .done();
    // })
    // .catch(function (error) {
    //     return next(error);
    // })
    // .done();

}

/**
 * @desc Chuyển sang Chốt
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateChot(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId;
    // let _user = AuthorizationService.getUser(req);

    let dataContract = {
        contractId: contractId,
        luuThongId: data._id,
        contractStatus: data.statusContract,
        luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED
    };
    EventDispatcher.updateStatusContractAndLuuThongListener(dataContract);

    HdLuuThongRepository.insertHdLuuThong(contractId, data)
        .then(function (contract) {
            res.send(201, true);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

/**
 * @desc Chuyển sang Bễ
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateBe(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId;
    // let _user = AuthorizationService.getUser(req);

    let dataContract = {
        contractId: contractId,
        luuThongId: data._id,
        contractStatus: data.statusContract,
        luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED
    };
    EventDispatcher.updateStatusContractAndLuuThongListener(dataContract);

    HdLuuThongRepository.insertHdLuuThong(contractId, data)
        .then(function (contract) {
            res.send(201, true);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}


module.exports = {
    list: list,
    listByDate: listByDate,
    one: one,
    update: update,
    updateMany: updateMany,
    updateChotLai: updateChotLai,
    updateThuVe: updateThuVe,
    updateChot: updateChot,
    updateBe: updateBe
};
