"use strict";

const RoleController = require('../controllers/roleController');
const {
    actions
} = require('../constant/permission');

const resource = "role";


module.exports = function (server) {

    let prefix = '/api/admin/v1/roles';

    /**
     * GET
     */
    server.get({
        path: `${prefix}`,
        actions: [`${resource}.${actions.list}`]
    }, RoleController.getList);
    server.get({
        path: `${prefix}/listRole`,
        actions: [`${resource}.${actions.list}`]
    }, RoleController.listRole);

    /**
     * CREATE
     */

    server.post({
        path: `${prefix}`,
        actions: [`${resource}.${actions.create}`]
    }, RoleController.create);

    /**
     * UPDATE
     */
    server.put({
        path: `${prefix}/:friendlyName`,
        actions: [`${resource}.${actions.update}`]
    }, RoleController.update);



    server.get({
        path: `${prefix}/:friendlyName`,
        actions: [`${resource}.${actions.list}`]
    }, RoleController.getByFriendlyName);


    server.del({
        path: `${prefix}/:friendlyName`,
        actions: [`${resource}.${actions.remove}`]
    }, RoleController.remove);
};