"use strict";

const StoreController = require('../controllers/storeController');
const UserController = require('../controllers/userController');

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
    server.get(prefix + '/listForUser', StoreController.listForUser);
    server.get(prefix + '/listUser', UserController.listUser);

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
