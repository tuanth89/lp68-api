"use strict";

const CustomerController = require('../controllers/customerController');
const {actions} = require("../constant/permission");

module.exports = function (server) {
    let prefix = '/api/admin/v1/customers';
    const resource = "customer";
    const resourceContract = "contract";

    /**
     * POST
     */
    server.post({
        path: prefix,
        actions: [`${resource}.${actions.update}`]
    }, CustomerController.create);
    server.post(prefix + '/insert/new', CustomerController.createMany);
    server.post(prefix + '/:customerId/checkExists', CustomerController.checkExists);

    /**
     * LIST
     */
    server.get({
        path: prefix + '/:storeId/list',
        actions: [`${resource}.${actions.list}`]
    }, CustomerController.list);

    /**
     * LIST
     */
    server.get({
        path: prefix + '/list/autoComplete',
        actions: [`${resourceContract}.${actions.list}`]
    }, CustomerController.listAutoComplete);

    /**
     * GET
     */
    server.get(prefix + '/:customerId', CustomerController.one);

    /**
     * UPDATE
     */
    server.put({
        path: prefix + '/:customerId',
        actions: [`${resource}.${actions.update}`]
    }, CustomerController.update);
    server.put(prefix + '/:customerId/imgDocs', CustomerController.updateImgDocs);

    /**
     * DELETE
     */
    server.del({
        path: prefix + '/:customerId',
        actions: [`${resource}.${actions.remove}`]
    }, CustomerController.remove);

};
