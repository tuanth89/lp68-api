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
        .then(function (luuthongs) {
            // Sinh các bản ghi lưu thông của ngày tiếp theo phải đóng tiền
            EventDispatcher.newContractLuuThongListener(luuthongs);

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
    // if (newPayMoney <= 0) {
    //     return next(new errors.InvalidContentError("Số tiền đóng không được <= 0"));
    // }
    // let _user = AuthorizationService.getUser(req);

    ContractRepository.findById(contractId)
        .then((contractItem) => {
            let money = contractItem.actuallyCollectedMoney - newPayMoney;
            // data.totalMoneyPaid = newPayMoney;
            let totalMoneyPaid = 0;

            // Trường hợp lãi đứng
            if (contractItem.status === CONTRACT_CONST.STAND && data.payMoneyOriginal !== undefined && data.payMoneyOriginal > 0) {
                totalMoneyPaid = contractItem.totalMoneyPaid + data.payMoneyOriginal;
                newPayMoney += data.payMoneyOriginal;
            }

            let dataContract = {
                contractId: contractId,
                luuThongId: data._id,
                contractStatus: money <= 0 ? CONTRACT_CONST.END : -1,
                luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
                totalMoneyPaid: totalMoneyPaid,
                luuthongMoneyPaid: newPayMoney,
                isLaiDung: true,
                dataLuuThong: data
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
 * @desc Chuyển sang Thu về, chốt, bễ, kết thúc
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function transferType(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId;
    let newPayMoney = data.newPayMoney !== undefined ? data.newPayMoney : 0;
    let payMoneyOriginal = data.payMoneyOriginal !== undefined ? data.payMoneyOriginal : 0;
    let luuthongMoneyPaid = newPayMoney + payMoneyOriginal;

    let hdLuuThongItem = {};
    if (data.isNotFromLuuThong) {
        data.contractId = data._id;
        data.luuthongMoneyPaid = luuthongMoneyPaid;
        hdLuuThongItem = HdLuuThongRepository.findAndInsertIfNotExists(data);
    }
    else {
        hdLuuThongItem = HdLuuThongRepository.findById(data._id);
    }

    hdLuuThongItem.then(luuthongItem => {
        if (luuthongItem.status === CONTRACT_OTHER_CONST.STATUS.COMPLETED && !luuthongItem.isNew) {
            luuthongMoneyPaid += luuthongItem.moneyPaid;
        }

        let dataContract = {
            contractId: contractId,
            luuThongId: luuthongItem._id,
            contractStatus: data.statusContract,
            luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
            luuthongMoneyPaid: luuthongMoneyPaid,
        };

        EventDispatcher.updateStatusContractAndLuuThongListener(dataContract);
        EventDispatcher.updateContractTotalMoneyPaidListener(data);

        res.send(201, true);
        next();

    })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done();
}

/**
 * @desc Đóng trước nhiều ngày
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateDongTruoc(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId;
    let luuthongMoneyPaid = data.newPayMoney !== undefined ? data.newPayMoney : 0;

    HdLuuThongRepository
        .findById(data._id)
        .then(luuthongItem => {
            if (luuthongItem.status === CONTRACT_OTHER_CONST.STATUS.COMPLETED && !luuthongItem.isNew) {
                luuthongMoneyPaid += luuthongItem.moneyPaid;
            }

            let dataContract = {
                contractId: contractId,
                luuThongId: luuthongItem._id,
                luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
                luuthongMoneyPaid: luuthongMoneyPaid,
                newPayMoney: data.newPayMoney !== undefined ? data.newPayMoney : 0,
                createdAt: data.createdAt
            };

            EventDispatcher.updateContractDongTruoc(dataContract);

            res.send(201, true);
            next();

        })
        .catch(function (error) {
            console.log(error);
            return next(error);
        })
        .done();
}

/**
 * @desc Cập nhật tổng tiền cho hợp đồng Thu về, Chốt, Bễ
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateTotalMoneyPaidTCB(req, res, next) {
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
            let totalMoneyPaid = contractItem.totalMoneyPaid + newPayMoney;

            let dataContract = {
                contractId: contractId,
                contractStatus: money <= 0 ? CONTRACT_CONST.END : -1,
                luuThongStatus: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
                totalMoneyPaid: totalMoneyPaid
            };
            EventDispatcher.updateStatusContractAndLuuThongListener(dataContract);

            data.creator = contractItem.creator;
            HdLuuThongRepository.insertHdLuuThongByTCB(contractId, data)
                .then(HdLuuThongItem => {
                    res.send(201, true);
                    next();
                })
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
    transferType: transferType,
    updateDongTruoc: updateDongTruoc,
    updateTotalMoneyPaidTCB: updateTotalMoneyPaidTCB

};
