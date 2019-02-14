/**
 */

const mongoose = require('mongoose');
const config = require('../config');
const _ = require('lodash');
const Q = require("q");
const errors = require('restify-errors');
const StringService = require('../src/services/stringService');

const Store = require('../src/models/store');

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
    console.err(`connect mongodb error: err = ${err}`);
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

let stores = [
    {
        "storeId": "TD",
        "name": "Thủ Dầu",
        "isActive": "1"
    },
    {
        "storeId": "Q11",
        "name": "Quận 11",
        "isActive": "1"
    },
    {
        "storeId": "HM",
        "name": "Hóc Môn",
        "isActive": "1"
    },
    {
        "storeId": "Q1-5",
        "name": "Quận 1-5",
        "isActive": "1"
    },
    {
        "storeId": "BC",
        "name": "Bình Chánh",
        "isActive": "1"
    },
    {
        "storeId": "LA",
        "name": "Long An",
        "isActive": "1"
    },
    {
        "storeId": "LT",
        "name": "Long Thành",
        "isActive": "1"
    },
    {
        "storeId": "TĐ",
        "name": "Thủ Đức",
        "isActive": "1"
    },
    {
        "storeId": "BP",
        "name": "Bình Phước",
        "isActive": "1"
    },
    {
        "storeId": "Q2",
        "name": "Quận 2",
        "isActive": "1"
    },
    {
        "storeId": "CC",
        "name": "Củ Chi",
        "isActive": "1"
    },
    {
        "storeId": "TT",
        "name": "Tam Trinh",
        "isActive": "1"
    },
    {
        "storeId": "TL",
        "name": "Từ Liêm",
        "isActive": "1"
    },
    {
        "storeId": "NB",
        "name": "Nhà Bè",
        "isActive": "1"
    },
    {
        "storeId": "Q8",
        "name": "Quận 8",
        "isActive": "1"
    },
    {
        "storeId": "Q7",
        "name": "Quận 7",
        "isActive": "1"
    },
    {
        "storeId": "Q12",
        "name": "Quận 12",
        "isActive": "1"
    },
    {
        "storeId": "BR",
        "name": "Bà Rịa",
        "isActive": "1"
    },
    {
        "storeId": "DA",
        "name": "Dĩ An",
        "isActive": "1"
    },
    {
        "storeId": "BT",
        "name": "Bình Thạnh",
        "isActive": "1"
    },
    {
        "storeId": "XM",
        "name": "Xuyên Mộc",
        "isActive": "1"
    }
];

let dropStore = function () {
    const deferred = Q.defer();

    Store.remove({}, function (error) {
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

db.once('open', () => {
    Promise.all([dropStore()]).then(function (results) {
        _.forEach(stores,function (item) {
            item.nameUnsign = StringService.removeSignInString(item.name);
        });

        Store.insertMany(stores)
            .then((result) => {
                // console.log("result ", result);
            })
            .catch(err => {
                console.error("error ", err);
            });
    });
});
