"use strict";

const PheConfigController = require('../controllers/pheConfigController');
const {actions} = require("../constant/permission");

module.exports = function (server) {
    let prefix = '/api/admin/v1/pheConfigs';
    const resource = "pheConfig";

    /**
     * POST
     */
    server.post({
        path: prefix,
        actions: [`${resource}.${actions.create}`]
    }, PheConfigController.create);

    /**
     * UPDATE
     */
    server.put({
        path: prefix + '/updateMany',
        actions: [`${resource}.${actions.update}`]
    }, PheConfigController.updateMany);

    /**
     * LIST
     */
    server.get({
        path: prefix + '/list',
        actions: [`${resource}.${actions.list}`]
    }, PheConfigController.list);

    /**
     * GET
     */
    server.get({
        path: prefix + '/:pheConfigId',
        actions: [`${resource}.${actions.list}`]
    }, PheConfigController.one);

    /**
     * DELETE
     */
    server.del({
        path: prefix + '/:pheConfigId',
        actions: [`${resource}.${actions.remove}`]
    }, PheConfigController.remove);

};
