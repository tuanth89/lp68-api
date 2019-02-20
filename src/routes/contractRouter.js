"use strict";

const ContractController = require('../controllers/contractController');
const {actions} = require("../constant/permission");

module.exports = function (server) {
    let prefix = '/api/admin/v1/contracts';
    const resource = "contract";

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
    server.post(prefix + '/:contractId/circulationContract', ContractController.circulationContract);

    /**
     * PUT
     */
    server.put(prefix + '/:contractId/updateTotalMoneyPaid', ContractController.updateTotalMoneyPaid);
    server.put(prefix + '/circulation/update', ContractController.updateDailyMoneyBulk);

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
    server.del({
            path: prefix  + '/:contractId',
            actions: [`${resource}.${actions.remove}`]
        }, ContractController.remove);

};
