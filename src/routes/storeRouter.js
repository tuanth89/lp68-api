"use strict";

const StoreController = require('../controllers/storeController');
const UserController = require('../controllers/userController');
const {
    actions
} = require('../constant/permission');

module.exports = function (server) {
    let prefix = '/api/admin/v1/stores';
    let resource = "store";

    /**
     * POST
     */
    server.post({
        path: `${prefix}`,
        actions: [`${resource}.${actions.update}`]
    }, StoreController.create);

    /**
     * LIST
     */
    server.get({
        path: `${prefix}`,
        actions: [`${resource}.${actions.list}`]
    }, StoreController.list);
    server.get(prefix + '/listForUser', StoreController.listForUser);
    server.get(prefix + '/listUser', UserController.listUser);
    server.get(prefix + '/listActive', StoreController.listActive);
    server.get(prefix + '/:storeId/listUserByStore', StoreController.listUserByStore);

    /**
     * GET
     */
    server.get({
        path: `${prefix}/:storeId`,
        actions: [`${resource}.${actions.list}`]
    }, StoreController.one);

    /**
     * UPDATE
     */
    server.put({
        path: `${prefix}`,
        actions: [`${resource}.${actions.update}`]
    }, StoreController.update);

    /**
     * DELETE
     */
    server.del({
        path: `${prefix}/:storeId`,
        actions: [`${resource}.${actions.remove}`]
    }, StoreController.remove);

};
