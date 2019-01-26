"use strict";

const UserController = require("../controllers/userController");
const ContractController = require("../controllers/ContractController");

const prefix = "/api/v1/admins";

module.exports = function (server) {
    /**
     * Cập nhật tài khoản hệ thống
     */
    server.put(prefix + "/:username",
        UserController.update
    );

    server.get(prefix + '/dashboard', ContractController.dashboardStatistic);

    /**
     * DELETE
     */

    server.del(prefix + "/:user_id",
        UserController.remove
    );
};