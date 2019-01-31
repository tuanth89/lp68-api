"use strict";

const StoreController = require('../controllers/storeController');

module.exports = function (server) {
    let prefix = '/api/admin/v1/stores';

    /**
     * POST
     */
    server.post(prefix, StoreController.create);

    /**
     * LIST
     */
    server.get(prefix, StoreController.list);

    /**
     * GET
     */
    server.get(prefix + '/:storeId', StoreController.one);

    /**
     * UPDATE
     */
    server.put(prefix, StoreController.update);

    /**
     * DELETE
     */
    server.del(prefix + '/:storeId', StoreController.remove);

};
