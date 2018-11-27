"use strict";

const CustomerController = require('../controllers/customerController');

module.exports = function (server) {
    let prefix = '/api/v1/customers';
    /**
     * POST
     */
    server.post(prefix, CustomerController.create);

    /**
     * LIST
     */
    server.get(prefix, CustomerController.list);

    /**
     * GET
     */
    server.get(prefix + '/:customerId', CustomerController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:customerId', CustomerController.update);

    /**
     * DELETE
     */
    server.del(prefix + '/:customerId', CustomerController.remove);

};
