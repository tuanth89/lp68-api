"use strict";

const HdLuuThongController = require('../controllers/hdLuuThongController');

module.exports = function (server) {
    let prefix = '/api/v1/hdLuuThongs';

    /**
     * LIST
     */
    server.get(prefix + '/listByDate/all', HdLuuThongController.listByDate);

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
    server.put(prefix + '/:contractId/updateThuve', HdLuuThongController.updateThuVe);
    server.put(prefix + '/:contractId/updateChot', HdLuuThongController.updateChot);
    server.put(prefix + '/:contractId/updateBe', HdLuuThongController.updateBe);

};