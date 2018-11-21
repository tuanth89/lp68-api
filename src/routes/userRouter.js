"use strict";

const UserController = require('../controllers/userController');

module.exports = function (server) {

    /**
     * POST
     */
    server.post('/api/v1/users', UserController.create);

    /**
     * LIST
     */
    server.get('/api/v1/users', UserController.list);

    /**
     * GET
     */
    server.get('/api/v1/users/:username', UserController.one);

    /**
     * UPDATE
     */
    server.put('/api/v1/users/:user_id', UserController.update);

    /**
     * DELETE
     */
    server.del('/api/v1/users/:user_id', UserController.remove);

};
