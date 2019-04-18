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
    server.get(prefix + '/newOrOld/all', ContractController.listNewOrOldByDate);
    server.get(prefix + '/allContract/byType', ContractController.listByType);
    server.get(prefix + '/:customerId/byCustomer', ContractController.listByCustomer);
    server.get(prefix + '/:creatorId/commissionFeeStaff', ContractController.listCommisionFeeStaff);

    /**
     * POST
     */
    server.post(prefix, ContractController.insertOrUpdateBulk);
    server.post(prefix + '/insertCusAndContract', ContractController.insertCusAndContractBulk);
    server.post(prefix + '/:contractId/circulationContract', ContractController.circulationContract);
    server.post(prefix + '/contractOld', ContractController.saveManyContractOld);

    /**
     * PUT
     */
    server.put(prefix + '/:contractId', ContractController.update);
    server.put(prefix + '/:contractId/changeStatus', ContractController.updateStatusEnd);
    // server.put(prefix + '/:contractId/updateTotalMoneyPaid', ContractController.updateTotalMoneyPaid);
    server.put(prefix + '/circulation/update', ContractController.updateDailyMoneyBulk);
    server.put({
        path: prefix + '/:contractId/updateComFeeStaff',
        actions: [`${resource}.${actions.editPheStaff}`]
    }, ContractController.updateMoneyFeeStaff);

    /**
     * GET
     */
    server.get(prefix + '/:contractId', ContractController.one);

    /**
     * DELETE
     */
    server.del({
        path: prefix + '/:contractId',
        actions: [`${resource}.${actions.remove}`]
    }, ContractController.remove);

};
