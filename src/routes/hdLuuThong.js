"use strict";

const ContractController = require('../controllers/contractController');

module.exports = function (server) {
    let prefix = '/api/v1/hdLuuThong';
    /**
     * POST
     */
    server.post(prefix, ContractController.insertOrUpdateBulk);

    /**
     * LIST
     */
    server.get(prefix + '/circulation/all', ContractController.listByDate);

    /**
     * GET
     */
    server.get(prefix + '/:contractId', ContractController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:contractId', ContractController.update);

};
