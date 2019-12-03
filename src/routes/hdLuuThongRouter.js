"use strict";

const HdLuuThongController = require('../controllers/hdLuuThongController');

module.exports = function (server) {
    let prefix = '/api/admin/v1/hdLuuThongs';

    /**
     * LIST
     */
    server.get(prefix + '/listByDate/all', HdLuuThongController.listByDate);
    server.get(prefix + '/listByDate/exportAll', HdLuuThongController.exportToExcel);

    /**
     * GET
     */
    server.get(prefix + '/:contractId', HdLuuThongController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:contractId', HdLuuThongController.update);

    /**
     * UPDATE
     */
    server.put(prefix + '/contract/updateMany', HdLuuThongController.updateMany);
    server.put(prefix + '/:contractId/updateLaiDung', HdLuuThongController.updateChotLai);
    server.put(prefix + '/:contractId/transferType', HdLuuThongController.transferType);
    server.put(prefix + '/:contractId/updateDongTruoc', HdLuuThongController.updateDongTruoc);

    /* Sửa tiền đã đóng theo ngày */
    server.put(prefix + '/:contractId/editMoneyPaidPerDay', HdLuuThongController.editMoneyPaid);

    // Update tổng tiền cho hợp đồng Thu về, Chốt, Bễ
    server.put(prefix + '/:contractId/updateTotalMoneyPaidTCB', HdLuuThongController.updateTotalMoneyPaidTCB);
};
