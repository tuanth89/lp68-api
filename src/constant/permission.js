module.exports = {
    actions: {
        list: 'list',
        create: "create",
        getOne: 'getOne',
        update: "update",
        remove: "remove",
        active: "active",
        disable: "disable",
        lock: "lock",
        unlock: "unlock",
        exportExcel: "exportExcel",
    },

    routeNames: [
        //Quản lý quyền
        "role.list",
        "role.create",
        "role.update",
        "role.remove",

        //Quản tài khoản hệ thống
        "admin.list",
        "admin.create",
        "admin.update",
        "admin.remove",
        "admin.lock",
        "admin.active",
        "admin.unlock",

        // //Quản tài khoản kế toán
        // "accountant.list",
        // "accountant.create",
        // "accountant.update",
        // "accountant.remove",
        // "accountant.lock",
        // "accountant.active",
        // "accountant.unlock",
        //
        // //Quản tài khoản Nhân viên
        // "staff.list",
        // "staff.create",
        // "staff.update",
        // "staff.remove",
        // "staff.lock",
        // "staff.active",
        // "staff.unlock",

        //Quản lý hợp đồng
        "contract.list",
        // "contract.create",
        "contract.update",
        "contract.remove",
        'contract.viewDate',

        //Quản lý cửa hàng
        "store.list",
        // "store.create",
        "store.update",
        "store.remove",

        //Quản lý khách hàng
        "customer.list",
        "customer.create",
        "customer.update",
        "customer.remove",

        //Quản lý cửa hàng
        "store.list",
        "store.create",
        "store.update",
        "store.remove",

        // Quản lý phế
        "tinhphe.list",
        "tinhphe.create",
        "tinhphe.update",
        "tinhphe.remove",

        // Thống kê
        "statistic.list"
    ]
};