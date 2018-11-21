"use strict";
const UserConstant = require('../../constant/userConstant');
const CourseRepository = require('../../repository/courseRepository');
const CourseRateRepository = require('../../repository/courseRateRepository');
const CategoryRepository = require('../../repository/categoryRepository');
const SubCategoryRepository = require('../../repository/subCategoryRepository');
const QuestionAnswerRepository = require('../../repository/questionAnswerRepository');
const RepliesRepository = require('../../repository/repliesRepository');
const UserRepository = require('../../repository/userRepository');
const SubscribeCourseRepository = require('../../repository/subscribeCourseRepository');
const log = require('../../../logger').log;
const StringService = require('../../services/stringService');

function newUserListener(user) {
    if (!user.roles || user.roles.length < 1) {
        // console.log(user);
        user.roles.push(UserConstant.ROLE_STUDENT);
        if (user.isLecture && user.roles.indexOf(UserConstant.ROLE_LECTURER) < 0) {
            user.roles.push(UserConstant.ROLE_LECTURER);
        }
        delete user.isLecture;

        user.save(function (error, user) {
            if (error) {

            } else {

            }
        });
    }
}

function updateInstructor(instructor) {
    CourseRepository.updateInstructorInfo(instructor)
        .then((updated) => {
            console.log(updated);
        })
        .catch((error) => {
            log.error(error);
        }).done();

    CategoryRepository.updateInstructorInfo(instructor)
        .then((updated) => {
            console.log(updated);
        })
        .catch((error) => {
            log.error(error);
        }).done();

    SubCategoryRepository.updateInstructorInfo(instructor)
        .then((updated) => {
            console.log(updated);
        })
        .catch((error) => {
            log.error(error);
        }).done();

    CourseRateRepository.updateUserInfo(instructor)
        .then((updated) => {
            console.log(updated);
        })
        .catch((error) => {
            log.error(error);
        }).done();

    QuestionAnswerRepository.updateUserInfo(instructor)
        .then((updated) => {
            console.log(updated);
        })
        .catch((error) => {
            log.error(error);
        }).done();

    RepliesRepository.updateUserInfo(instructor)
        .then((updated) => {
            console.log(updated);
        })
        .catch((error) => {
            log.error(error);
        }).done();

    SubscribeCourseRepository.updateInstructorInfo(instructor)
        .then((updated) => {
            console.log(updated);
        })
        .catch((error) => {
            log.error(error);
        }).done();

    if (instructor && instructor.name) {
        let splitName = instructor.name.trim().split(" ");
        instructor.firstName = StringService.stripHtmlTag(splitName[splitName.length - 1]);
        instructor.lastName = StringService.stripHtmlTag(instructor.name.substr(0, instructor.name.length - instructor.firstName.length).trim());

        UserRepository.updateUserInfo(instructor)
            .then((updated) => {
                console.log(updated);
            })
            .catch((error) => {
                log.error(error);
            }).done();
    }
}

function updateInstructorTopic(course) {
    if (course.topic && course.topic.length > 0) {
        UserRepository.addTopics(course.instructor.username, course.topic[0])
            .catch((error) => {
                log.error(error);
            }).done();
    }
}

module.exports = {
    newUserListener: newUserListener,
    updateInstructor: updateInstructor,
    updateInstructorTopic: updateInstructorTopic
};