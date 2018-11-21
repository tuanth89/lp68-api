const CourseRepository = require('../src/repository/courseRepository');
const StringService = require('../src/services/stringService');
const mongoose = require('mongoose');
const config = require('../config');
const _ = require('lodash');

// establish connection to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri, {auth: config.db.auth});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

CourseRepository.getList({})
    .then((courses) => {
        courses.map(course => {
            let nameE = StringService.getUrlFriendlyString(course.name);
            course.nameE = nameE;
            course.save(function(error, docs) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('update curriculum for ' + course.name + '\n');
                }
            });
        });
    })
    .catch((error) => {
        console.log(error);
    })
;
