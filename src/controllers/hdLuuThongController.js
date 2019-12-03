"use strict";

const errors = require('restify-errors');
const ContractRepository = require('../repository/contractRepository');
const HdLuuThongRepository = require('../repository/hdLuuThongRepository');
const HdLuuThongOtherRepository = require('../repository/hdLuuThongOtherRepository');
const AuthorizationService = require('../services/authorizationService');
const EventDispatcher = require('../events/dispatcher');
const _ = require('lodash');
const moment = require('moment');
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');
const CONTRACT_CONST = require('../constant/contractConstant');
const log = require('../../logger').log;
const excel = require('exceljs');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');

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
    // let contractTemp = JSON.parse("[{\"_id\":\"5cc490fe0cc46e0a3b189c18\",\"customer\":{\"name\":\"Tuan\",\"_id\":\"5cbd6505faaaaa0bc3cf2817\"},\"customerId\":\"5cbd6505faaaaa0bc3cf2817\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-28\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c18\",\"loanEndDate\":\"2019-05-08\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true},{\"_id\":\"5cc490fe0cc46e0a3b189c1a\",\"customer\":{\"name\":\"GAGA\",\"_id\":\"5cbf415e8575a10b54bc965e\"},\"customerId\":\"5cbf415e8575a10b54bc965e\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-27\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c1a\",\"loanEndDate\":\"2019-05-07\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true},{\"_id\":\"5cc490fe0cc46e0a3b189c1c\",\"customer\":{\"name\":\"GAGA\",\"_id\":\"5cbf415e8575a10b54bc965e\"},\"customerId\":\"5cbf415e8575a10b54bc965e\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-28\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c1c\",\"loanEndDate\":\"2019-05-08\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true}]");
    // EventDispatcher.totalLuuThongTangGiamListener(contractTemp, true);

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

function exportToExcel(req, res, next) {
    // let contractTemp = JSON.parse("[{\"_id\":\"5cc490fe0cc46e0a3b189c18\",\"customer\":{\"name\":\"Tuan\",\"_id\":\"5cbd6505faaaaa0bc3cf2817\"},\"customerId\":\"5cbd6505faaaaa0bc3cf2817\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-28\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c18\",\"loanEndDate\":\"2019-05-08\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true},{\"_id\":\"5cc490fe0cc46e0a3b189c1a\",\"customer\":{\"name\":\"GAGA\",\"_id\":\"5cbf415e8575a10b54bc965e\"},\"customerId\":\"5cbf415e8575a10b54bc965e\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-27\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c1a\",\"loanEndDate\":\"2019-05-07\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true},{\"_id\":\"5cc490fe0cc46e0a3b189c1c\",\"customer\":{\"name\":\"GAGA\",\"_id\":\"5cbf415e8575a10b54bc965e\"},\"customerId\":\"5cbf415e8575a10b54bc965e\",\"loanMoney\":10000000,\"actuallyCollectedMoney\":10000000,\"loanDate\":10,\"createdAt\":\"2019-04-28\",\"dateEnd\":\"\",\"isHdLaiDung\":false,\"isHdDao\":false,\"isHdThuVe\":false,\"isHdChot\":false,\"isHdBe\":false,\"isCustomerNew\":false,\"storeId\":\"5c64e4e4b524f513fc9cf74e\",\"storeCode\":\"TD\",\"customerCode\":\"tientd\",\"creator\":\"5c6292a66003663f387b6c0f\",\"isRemove\":true,\"typeCode\":\"XM\",\"contractId\":\"5cc490fe0cc46e0a3b189c1c\",\"loanEndDate\":\"2019-05-08\",\"dailyMoneyPay\":\"1000000\",\"status\":0,\"createContractNew\":true}]");
    // EventDispatcher.totalLuuThongTangGiamListener(contractTemp, true);

    let _user = AuthorizationService.getUser(req);
    if (!_user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired !")
        );
    }
    req.params.roles = _user.userRoles;
    req.params.exportExcel = true;

    HdLuuThongRepository.getListByDate(req.params)
        .then(function (contracts) {
            exportService(contracts, _user, res, next);
        })
        .catch(function (error) {
            return next(error);
        })
        .done();
}

function exportService(contracts, _user, res, next) {
    var workbook = new excel.Workbook();
    workbook.addWorksheet("Sheet1");

    var worksheet = workbook.getWorksheet("Sheet1");
    var borderStyles = {top: {style: "thin"}, left: {style: "thin"}, bottom: {style: "thin"}, right: {style: "thin"}};

    worksheet.getCell(1, 1).value = "Họ và tên";
    worksheet.getCell('B1').value = "Ngày vay";
    worksheet.getCell('C1').value = "Gói vay";
    worksheet.getCell('D1').value = "Thực thu";
    worksheet.getCell('E1').value = "Dư nợ";
    worksheet.getCell('F1').value = "Đã đóng";
    worksheet.getCell('G1').value = "Đóng trong ngày";
    worksheet.getCell('H1').value = "Số hợp đồng";
    worksheet.getCell('I1').value = "Ghi chú";

    let index = 0;

    _.each(contracts, (item) => {
        worksheet.getCell(2 + index, 1).value = item.customer.name;
        worksheet.getCell(2 + index, 1).border = borderStyles;

        worksheet.getCell(2 + index, 2).value = moment(item.contractCreatedAt).format("DD/MM/YYYY");
        worksheet.getCell(2 + index, 2).border = borderStyles;

        worksheet.getCell(2 + index, 3).value = item.loanMoney;
        worksheet.getCell(2 + index, 3).border = borderStyles;

        worksheet.getCell(2 + index, 4).value = item.actuallyCollectedMoney;
        worksheet.getCell(2 + index, 3).border = borderStyles;

        worksheet.getCell(2 + index, 5).value = item.totalHavePay;
        worksheet.getCell(2 + index, 5).border = borderStyles;

        worksheet.getCell(2 + index, 6).value = item.totalMoneyPaid;
        worksheet.getCell(2 + index, 6).border = borderStyles;

        worksheet.getCell(2 + index, 7).value = item.moneyPaid;
        worksheet.getCell(2 + index, 7).border = borderStyles;

        worksheet.getCell(2 + index, 8).value = item.contractNo;
        worksheet.getCell(2 + index, 8).border = borderStyles;

        worksheet.getCell(2 + index, 9).value = item.note;
        worksheet.getCell(2 + index, 9).border = borderStyles;


        index++;
    });

    worksheet.getCell('A1').border = borderStyles;
    worksheet.getCell('B1').border = borderStyles;
    worksheet.getCell('C1').border = borderStyles;
    worksheet.getCell('D1').border = borderStyles;
    worksheet.getCell('E1').border = borderStyles;
    worksheet.getCell('F1').border = borderStyles;
    worksheet.getCell('G1').border = borderStyles;
    worksheet.getCell('H1').border = borderStyles;
    worksheet.getCell('I1').border = borderStyles;

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 15;

    worksheet.getCell(1, 1).alignment = {vertical: 'middle', horizontal: 'left'};
    worksheet.getCell(1, 2).alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getCell(1, 3).alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getCell(1, 4).alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getCell(1, 5).alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getCell(1, 6).alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getCell(1, 7).alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getCell(1, 8).alignment = {vertical: 'middle', horizontal: 'left'};
    worksheet.getCell(1, 9).alignment = {vertical: 'middle', horizontal: 'left'};

    let today = new Date();
    let username = _user.username;
    let fileName = `Danh_sach_Luu_Thong_ngay_${today.getDate()}-${today.getMonth()}-${today.getFullYear()}.xlsx`;
    let excelPath = path.join(__basedir, '/upload/', username, '/', today.getFullYear().toString(),
        '/', (today.getMonth() + 1).toString(), '/', today.getDate().toString());

    mkdirp(excelPath, function (err) {
        if (err) {
            console.log(err);
        } else {
            excelPath = path.join(excelPath, "/", fileName);
            workbook.xlsx.writeFile(excelPath).then(function (error, result) {
                if (error) {
                    return next(error);
                } else {
                    fs.readFile(excelPath, function (err, data) {
                        if (err) {
                            return next(err);
                        }

                        fs.stat(excelPath, (error, stat) => {
                            if (error)
                                return;

                            if (stat.isFile()) {
                                fs.unlink(excelPath, function (err) {
                                    if (err && err.code === 'ENOENT') {
                                        // file doens't exist
                                        console.log("File doesn't exist, won't remove it.");
                                    } else if (err) {
                                        // other errors, e.g. maybe we don't have enough permission
                                        console.log("Error occurred while trying to remove file");
                                    } else {
                                        console.log(`removed file : ${excelPath}`);
                                    }
                                });
                            }
                        });

                        res.header('Content-Disposition', `attachment; filename=${fileName}`);
                        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.send(data);

                        next();
                    });
                }
            });
        }
    });
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
            if (luuthongs.length > 0) {
                // Sinh các bản ghi lưu thông của ngày tiếp theo phải đóng tiền
                EventDispatcher.newContractLuuThongListener(luuthongs);

                // ghi log lưu vết cho các hợp đồng
                EventDispatcher.addMultiLogToContractLogListener(data);
            }

            res.send(200);
            next();
        })
        .catch(function (error) {
            return next(error);
        })
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
    } else {
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

        let reportItem = {storeId: data.storeId};
        let debtContract = Math.max(0, data.actuallyCollectedMoney - (data.totalMoneyPaid + payMoneyOriginal));
        /* Cập nhật báo cáo theo ngày */
        if (!data.isNotFromLuuThong) { // Chuyển từ Lưu Thông sang Thu về, chốt, bễ
            /* Thu ve, chot, be tăng khi chuyển từ Lưu Thông sang */
            reportItem.createdAt = moment(data.createdAt, "DD/MM/YYYY").format("YYYY-MM-DD");
            if (data.newTransferDate)
                reportItem.createdAt = data.newTransferDate;

            if (data.status === CONTRACT_CONST.NEW) {
                reportItem.luuThongSLGiam = 1;
                reportItem.luuThongMoneyGiam = luuthongMoneyPaid;
            }

            /* Thu về tăng */
            if (data.statusContract === CONTRACT_CONST.COLLECT) {
                reportItem.thuVeSLTang = 1;
                reportItem.thuVeMoneyTang = debtContract;
            }

            /* Chốt tăng */
            if (data.statusContract === CONTRACT_CONST.CLOSE_DEAL) {
                reportItem.chotSLTang = 1;
                reportItem.chotMoneyTang = debtContract;
            }

            /* Bễ tăng */
            if (data.statusContract === CONTRACT_CONST.ESCAPE) {
                reportItem.beSLTang = 1;
                reportItem.beMoneyTang = debtContract;
            }

        }
        /* Thu ve, chot, be tăng giảm khi chuyển qua lại lẫn nhau */
        else {
            reportItem.createdAt = moment().format("YYYY-MM-DD");
            if (data.newTransferDate)
                reportItem.createdAt = data.newTransferDate;

            /* Thu về giảm */
            if (data.status === CONTRACT_CONST.COLLECT) {
                reportItem.thuVeSLGiam = 1;
                reportItem.thuVeMoneyGiam = debtContract;
            }

            /* Thu về tăng */
            if (data.statusContract === CONTRACT_CONST.COLLECT) {
                reportItem.thuVeSLTang = 1;
                reportItem.thuVeMoneyTang = debtContract;
            }

            /* Chốt giảm */
            if (data.status === CONTRACT_CONST.CLOSE_DEAL) {
                reportItem.chotSLGiam = 1;
                reportItem.chotMoneyGiam = debtContract;
            }

            /* Chốt tăng */
            if (data.statusContract === CONTRACT_CONST.CLOSE_DEAL) {
                reportItem.chotSLTang = 1;
                reportItem.chotMoneyTang = debtContract;
            }

            /* Bễ giảm */
            if (data.status === CONTRACT_CONST.ESCAPE) {
                reportItem.beSLGiam = 1;
                reportItem.beMoneyGiam = debtContract;
            }

            /* Bễ tăng */
            if (data.statusContract === CONTRACT_CONST.ESCAPE) {
                reportItem.beSLTang = 1;
                reportItem.beMoneyTang = debtContract;
            }
        }
        EventDispatcher.totalLuuThongTangGiamListener(reportItem, false);

        /* Ghi log đóng tiền */
        let contractLog = [{
            contractId: contractId,
            moneyPaid: payMoneyOriginal,
            createdAt: data.newTransferDate,
            newPayMoney: newPayMoney,
            isTransferType: true
        }];
        EventDispatcher.addMultiLogToContractLogListener(contractLog);

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

            /* ghi log lưu vết đã đóng cho hợp đồng */
            let contractLog = [{
                contractId: contractId,
                moneyPaid: data.newPayMoney !== undefined ? data.newPayMoney : 0,
                createdAt: data.createdAt
            }];
            EventDispatcher.addMultiLogToContractLogListener(contractLog);

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

            /* ghi log lưu vết đã đóng cho hợp đồng */
            let contractLog = [{
                contractId: contractId,
                moneyPaid: newPayMoney,
                createdAt: data.payDate
            }];
            EventDispatcher.addMultiLogToContractLogListener(contractLog);

            data.creator = contractItem.creator;
            HdLuuThongOtherRepository.insertHdLuuThongByTCB(contractId, data)
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

/**
 * @desc Sửa tiền đã dóng theo ngày và tính lại tổng tiền.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function editMoneyPaid(req, res, next) {
    let data = req.body || {};
    let contractId = req.params.contractId;
    let payMoneyOriginal = parseInt(data.payMoneyOriginal);
    if (payMoneyOriginal < 0) {
        return next(new errors.InvalidContentError("Số tiền đóng không được < 0"));
    }

    let isTVChotBe = data.isTVChotBe;

    let moneyPaid = data.moneyPaid;

    ContractRepository.findById(contractId)
        .then((contractItem) => {
            let totalMoneyPaid = contractItem.totalMoneyPaid + payMoneyOriginal - moneyPaid;

            let dataContract = {
                // luuThongId: data._id,
                contractId: contractId,
                totalMoneyPaid: totalMoneyPaid,
                moneyPaidOld: moneyPaid,
                moneyPaidNew: payMoneyOriginal,
                createdAt: data.createdAt
            };

            if (isTVChotBe) {
                dataContract.otherLuuThongId = data.luuThongOtherId;
                dataContract.createdAt = data.payDate;
            } else {
                dataContract.luuThongId = data._id;
            }

            EventDispatcher.editMoneyPaidPerDayListener(dataContract);

            res.send(200);
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
    exportToExcel,
    one: one,
    update: update,
    updateMany: updateMany,
    updateChotLai: updateChotLai,
    transferType: transferType,
    updateDongTruoc: updateDongTruoc,
    editMoneyPaid: editMoneyPaid,
    updateTotalMoneyPaidTCB: updateTotalMoneyPaidTCB

};
