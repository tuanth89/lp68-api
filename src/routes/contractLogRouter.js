"use strict";

const ContractLogController = require('../controllers/contractLogController');

module.exports = function (server) {
    let prefix = '/api/v1/contractLogs';

    /**
     * LIST
     */

    /**
     * GET
     */
    server.get(prefix + '/:contractId', ContractLogController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:contractId/add-history', ContractLogController.addHistory);

};
