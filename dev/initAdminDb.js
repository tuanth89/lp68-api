/**
 * Khởi tạo db mẫu cho các phần liên quan đến trang quản trị
 */

const mongoose = require('mongoose');
const Q = require("q");
const errors = require('restify-errors');
const config = require('../config');

// const RoleModel = require('../src/admin/models/role');
const FeatureAccessModel = require('../src/models/featureAccess');

// establish connection to mongodb
mongoose.Promise = global.Promise;

const options = {
    auth: config.db.auth,
    useNewUrlParser: true,
    autoIndex: true, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(config.db.uri, options).then(() => {
    console.log(`connect mongodb success`);
}, err => {
    console.err(`connect mongodb error: err = ${ err }`);
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

// let dropRole = function () {
//     const deferred = Q.defer();
//     RoleModel.remove({}, function (error) {
//         if (error) {
//             console.error(error);
//             deferred.reject(
//                 new errors.InvalidContentError(error.message)
//             );
//         } else {
//             deferred.resolve(true);
//         }
//     });
//
//     return deferred.promise;
// };

let dropFeatureAccess = function () {
    const deferred = Q.defer();
    FeatureAccessModel.remove({}, function (error) {
        if (error) {
            console.error(error);
            deferred.reject(
                new errors.InvalidContentError(error.message)
            );
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
};

let roles = [
    {
        "isDefault": true,
        "name": "Super Admin",
        "description": "Super admin",
        "friendlyName": "super-admin",
    },
    {
        "isDefault": false,
        "name": "Admin",
        "description": "Admin - Người quản trị",
        "friendlyName": "admin",
    }
];

let featureAccesses = [
    {
        "name": "Hợp đồng",
        "friendlyName": "contract",
        "priority": 0,
        "actions": [
            {
                "routeName": "contract.list",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "contract.viewDate",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "contract.update",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "contract.remove",
                "roles": [
                    "super-admin"
                ]
            }
        ],
        "groupName": "Hợp đồng"
    },
    {
        "groupName": "Khách hàng",
        "name": "Khách hàng",
        "friendlyName": "customer",
        "priority": 1,
        "actions": [{
            "routeName": "customer.list",
            "roles": [
                "super-admin"
            ]
        },
            {
                "routeName": "customer.create",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "customer.update",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "customer.remove",
                "roles": [
                    "super-admin"
                ]
            }
        ]
    },
    {
        "name": "Quản lý tài khoản hệ thống",
        "friendlyName": "admin",
        "priority": 2,
        "actions": [
            {
                "routeName": "admin.list",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "admin.create",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "admin.update",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "admin.remove",
                "roles": [
                    "super-admin"
                ]
            },
            // {
            //     "routeName": "admin.lock",
            //     "roles": [
            //         "super-admin"
            //     ]
            // },
            // {
            //     "routeName": "admin.active",
            //     "roles": [
            //         "super-admin"
            //     ]
            // },
            // {
            //     "routeName": "admin.unlock",
            //     "roles": [
            //         "super-admin"
            //     ]
            // }
        ],
        "groupName": "Tài khoản"
    },
    {
        "groupName": "Thống kê",
        "name": "Thống kê",
        "friendlyName": "statistic",
        "priority": 3,
        "actions": [{
            "routeName": "statistic.list",
            "roles": [
                "super-admin"
            ]
        }
        ]
    },
    {
        "groupName": "Tính phế",
        "name": "Tính phế",
        "friendlyName": "tinhphe",
        "priority": 4,
        "actions": [{
            "routeName": "tinhphe.list",
            "roles": [
                "super-admin"
            ]
        },
            {
                "routeName": "tinhphe.create",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "tinhphe.update",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "tinhphe.remove",
                "roles": [
                    "super-admin"
                ]
            }
        ]
    },
    {
        "groupName": "Cửa hàng",
        "name": "Cửa hàng",
        "friendlyName": "store",
        "priority": 5,
        "actions": [{
            "routeName": "store.list",
            "roles": [
                "super-admin"
            ]
        },
            {
                "routeName": "store.create",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "store.update",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "store.remove",
                "roles": [
                    "super-admin"
                ]
            }
        ]
    },
    {
        "groupName": "Tài khoản",
        "name": "Quản lý nhóm quyền",
        "friendlyName": "role",
        "priority": 6,
        "hidden": true,
        "actions": [
            {
                "routeName": "role.list",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "role.create",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "role.update",
                "roles": [
                    "super-admin"
                ]
            },
            {
                "routeName": "role.remove",
                "roles": [
                    "super-admin"
                ]
            }
        ]
    }
    // {
    //     "groupName": "Tài khoản",
    //     "name": "Quản lý Nhân viên",
    //     "friendlyName": "staff",
    //     "priority": 7,
    //     "actions": [
    //         {
    //             "routeName": "staff.list",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "staff.create",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "staff.update",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "staff.remove",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "staff.lock",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "staff.active",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "staff.unlock",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         }
    //     ]
    // },
    // {
    //     "groupName": "Tài khoản",
    //     "name": "Quản lý Kế Toán",
    //     "friendlyName": "accountant",
    //     "priority": 8,
    //     "actions": [
    //         {
    //             "routeName": "accountant.list",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "accountant.create",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "accountant.update",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "accountant.remove",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "accountant.active",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "accountant.lock",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         },
    //         {
    //             "routeName": "accountant.unlock",
    //             "roles": [
    //                 "super-admin"
    //             ]
    //         }
    //     ]
    // },
];
db.once('open', () => {
    //remove old data
    Promise.all([dropFeatureAccess()]).then(function (results) {
        // roles.forEach(item => {
        //     RoleModel.create(item).then(resp => {
        //
        //     }).catch(err => {
        //         console.log(err);
        //     })
        // });

        featureAccesses.forEach(item => {
            FeatureAccessModel.create(item).then(resp => {

            }).catch(err => {
                console.log(err);
            })
        });
    });
});