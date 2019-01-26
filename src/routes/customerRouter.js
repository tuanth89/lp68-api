"use strict";

const CustomerController = require('../controllers/customerController');

module.exports = function (server) {
    let prefix = '/api/v1/customers';
    /**
     * POST
     */
    server.post(prefix, CustomerController.create);
    server.post(prefix + '/insert/new', CustomerController.createMany);

    /**
     * LIST
     */
    server.get(prefix, CustomerController.list);

    /**
     * LIST
     */
    server.get(prefix + '/list/autoComplete', CustomerController.listAutoComplete);

    /**
     * GET
     */
    server.get(prefix + '/:customerId', CustomerController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:customerId', CustomerController.update);
    server.put(prefix + '/:customerId/imgDocs', CustomerController.updateImgDocs);

    /**
     * DELETE
     */
    server.del(prefix + '/:customerId', CustomerController.remove);

};
