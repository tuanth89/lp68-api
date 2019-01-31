"use strict";

const UserController = require("../controllers/userController");
const ContractController = require("../controllers/contractController");
const {actions} = require("../constant/permission");

const prefix = "/api/admin/v1/admins";
const resource = "admin";

module.exports = function (server) {
    /**
     * Cập nhật tài khoản hệ thống
     */
    server.put(prefix + "/:username",
        UserController.update
    );

    /**
     * Thêm mới tài khoản hệ thống
     */
    server.post({
            path: prefix,
            actions: [`${resource}.${actions.create}`]
        },
        UserController.createUserSystem
    );

    /**
     * Cập nhật tài khoản hệ thống
     */
    server.put({
            path: prefix + "/:user_id",
            actions: [`${resource}.${actions.update}`]
        },
        UserController.updateUserSystem
    );

    /**
     * GET
     */
    server.get({
            path: prefix + '/listAdmin',
            actions: [`${resource}.${actions.list}`]
        },
        UserController.listUserSystem
    );
    server.get(prefix + '/dashboard', ContractController.dashboardStatistic);
    server.get({
            path: prefix + "/:username",
            actions: [`${resource}.${actions.list}`]
        },
        UserController.one
    );

    /**
     * DELETE
     */

    server.del(prefix + "/:user_id",
        UserController.remove
    );
};