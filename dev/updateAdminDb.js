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

let featureAccesses = [
    {
        "groupName": "Báo cáo",
        "name": "Quản lý báo cáo",
        "friendlyName": "reportDaily",
        "priority": 8,
        "actions": [
            {
                "routeName": "reportDaily.list",
                "roles": [
                    "super-admin"
                ]
            }
        ]
    }
];
db.once('open', () => {
    featureAccesses.forEach(item => {
        FeatureAccessModel.create(item).then(resp => {

        }).catch(err => {
            console.log(err);
        })
    });
});