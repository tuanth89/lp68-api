/**
 */

const mongoose = require('mongoose');
const config = require('../config');
const _ = require('lodash');
const XLSX = require('xlsx');
const Q = require('q');

const PheConfig = require('../src/models/pheConfig');

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

let dropPheConfig = function () {
    const deferred = Q.defer();

    PheConfig.remove({}, function (error) {
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
    let workbook = XLSX.readFile('dev/cuahang.xlsx');
    let sheet_name_list = workbook.SheetNames;
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    // console.log(arrKhachMoi);

    let arrayKhachMoi = [];

    _.forEach(data, (item) => {
        let money = item.money;
        _.each(item, function (value, key) {
            let itemKM = Object.assign({});
            if (key === "money") {
                return;
            }
            itemKM.day = key;
            itemKM.loanMoneyPack = money;
            itemKM.receive = value;
            itemKM.isNewCustomer = true;
            arrayKhachMoi.push(itemKM);
            // console.log(arrayKhachMoi);
        });

        // let itemKM = Object.assign({});
        // itemKM.day = 15;
        // itemKM.money = item.money;
        // itemKM.receive = item.ngay15;
        // arrayKhachMoi.push(itemKM);
    });

    // console.log(arrayKhachMoi);

    // Promise.all([dropPheConfig()]).then(function (results) {
        PheConfig.insertMany(arrayKhachMoi)
            .then((result) => {
                console.log("result ", result);
            })
            .catch(err => {
                console.error("error ", err);
            });
    // });

});
