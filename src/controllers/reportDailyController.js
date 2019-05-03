"use strict";

const ReportDailyRepository = require('../repository/reportDailyRepository');
const AuthorizationService = require('../services/authorizationService');

/**
 *
 * @param req
 * @param res
 * @param next
 */
function listByDate(req, res, next) {
    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    req.params.roles = _user.userRoles;

    ReportDailyRepository.getListByDate(req.params)
        .then(function (stores) {
            res.send(stores);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
    // }
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function totalContractDailyByDate(req, res, next) {
    Promise.all([
        ReportDailyRepository.getListByDate(req.params),
        ReportDailyRepository.totalCusLuuThongByDate(req.params),
        ReportDailyRepository.totalCusThuVeChotBeByDate(req.params),
    ])
        .then(function (results) {
            // let data = {
            //     reportDaily: results[0],
            //     totalCusLuuThong: results[1],
            //     totalCusThuVeChotBe: results[2]
            // };

            let data = Object.assign(results[0], results[1], results[1]);

            res.send(200, data);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
}

module.exports = {
    listByDate: listByDate,
    totalContractDailyByDate: totalContractDailyByDate
};
