/**
 */

const mongoose = require('mongoose');
const config = require('../config');
const _ = require('lodash');
const XLSX = require('xlsx');
const Q = require('q');
const StringService = require('../src/services/stringService');

const Customer = require('../src/models/customer');

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

db.once('open', () => {
    Customer.find({}).select("_id name").exec((err, res) => {
        res.forEach(item => {
            item.nameE = StringService.removeSignInString(item.name);
            Customer.findOneAndUpdate({_id: item._id}, item, {upsert: true}, (err, resp) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log("updated course item success:" + item._id);
                }
            });
        });
    })

});
