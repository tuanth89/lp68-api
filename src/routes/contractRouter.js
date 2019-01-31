"use strict";

const ContractController = require('../controllers/contractController');

module.exports = function (server) {
    let prefix = '/api/admin/v1/contracts';

    /**
     * LIST
     */
    server.get(prefix, ContractController.list);
    server.get(prefix + '/circulation/all', ContractController.listByDate);
    server.get(prefix + '/allContract/byType', ContractController.listByType);
    server.get(prefix + '/:customerId/byCustomer', ContractController.listByCustomer);

    /**
     * POST
     */
    server.post(prefix, ContractController.insertOrUpdateBulk);
    server.put(prefix + '/circulation/update', ContractController.updateDailyMoneyBulk);
    server.post(prefix + '/:contractId/circulationContract', ContractController.circulationContract);

    /**
     * GET
     */
    server.get(prefix + '/:contractId', ContractController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:contractId', ContractController.update);
    server.put(prefix + '/:contractId/changeStatus', ContractController.updateStatus);

    /**
     * DELETE
     */
    server.del(prefix + '/:contractId', ContractController.remove);

};
