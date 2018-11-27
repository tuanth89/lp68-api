"use strict";

const ContractController = require('../controllers/contractController');

module.exports = function (server) {
    let prefix = '/api/v1/contracts';
    /**
     * POST
     */
    server.post(prefix, ContractController.create);

    /**
     * LIST
     */
    server.get(prefix, ContractController.list);
    server.get(prefix + '/circulation/all', ContractController.listByDate);

    /**
     * GET
     */
    server.get(prefix + '/:contractId', ContractController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:contractId', ContractController.update);

    /**
     * DELETE
     */
    server.del(prefix + '/:contractId', ContractController.remove);

};
