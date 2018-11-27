/**
 * Created by giang on 3/18/18.
 */

const mongoose = require('mongoose');
const Q = require("q");
const errors = require('restify-errors');
const config = require('../config');

const User = require('../src/models/user');
const UserRepository = require('../src/repository/userRepository');

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

if (config.db.authorizationEnabled) {
    mongoose.connect(config.db.uri, {
        auth: config.db.auth
    });
} else {
    mongoose.connect(config.db.uri);
}

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

let dropUser = function () {
    const deferred = Q.defer();

    User.remove({}, function (error) {
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

let users = [
    {
        fullName: "admin",
        firstName: "admin",
        lastName: "admin",
        username: "admin",
        email: "admin@gmail.com",
        password: "123456",
        photo: '/assets/images/717783_3157.jpg',
        roles: ['ROLE_ADMIN'],
        enabled: true
    },
    {
        fullName: "Super Admin",
        firstName: "Super",
        lastName: "Admin",
        username: "root",
        email: "root@gmail.com",
        password: "123456",
        photo: '/assets/images/717783_3157.jpg',
        roles: ['ROLE_ROOT'],
        enabled: true
    }
];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

db.once('open', () => {
    //remove old data
    Promise.all([dropUser()]).then(function (results) {
        console.log('all entities deleted');
        for (let i in users) {
            UserRepository.save(users[i])
                .then(function (user) {
                    console.log('all users created');
                })
                .catch(function (error) {
                    console.log(error.message);
                });
        }
    });
});