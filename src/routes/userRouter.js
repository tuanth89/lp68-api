"use strict";

const UserController = require('../controllers/userController');

module.exports = function (server) {
    let prefix = '/api/admin/v1/users';
    /**
     * POST
     */
    server.post(prefix, UserController.create);

    /**
     * LIST
     */
    server.get(prefix, UserController.list);

    /**
     * GET
     */
    server.get(prefix + '/:username', UserController.one);

    /**
     * UPDATE
     */
    server.put(prefix + '/:user_id', UserController.update);

    /**
     * DELETE
     */
    server.del(prefix + '/:user_id', UserController.remove);

};
