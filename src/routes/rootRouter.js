"use strict";

const UserController = require('../controllers/userController');
const prefix = '/api/v1/roots';

module.exports = function (server) {
    /**
     * UPDATE
     */
    server.put(prefix + '/:username', UserController.update);

    /**
     * GET
     */
    server.get(prefix + '/:username', UserController.one);

    /**
     * DELETE
     */
    server.del(prefix + '/:username', UserController.remove);
};
