"use strict";

const UserController = require("../controllers/userController");

const prefixUrl = "/api/v1/admins";

module.exports = function (server) {
    /**
     * Cập nhật tài khoản hệ thống
     */
    server.put(prefixUrl + "/:username",
        UserController.update
    );


    // server.get(prefixUrl + "/:username/dashboard",
    //     UserController.dashboardInformation
    // );
    /**
     * DELETE
     */

    server.del(prefixUrl + "/:user_id",
        UserController.remove
    );
};