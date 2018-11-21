"use strict";

const questionAnswerRepository = require('../../repository/questionAnswerRepository');
const repliesRepository = require('../../repository/repliesRepository');
const log = require('../../../logger').log;
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');

/**
 * Remove questionAnswers of user deleted.
 * @param {ObjectId} userId 
 */
function removeQuestionAnswers(userId) {
    questionAnswerRepository.findByUserId(userId)
        .then(function (questionAnswers) {
            if (questionAnswers && questionAnswers.length > 0) {
                let ids = _.map(questionAnswers, function (item) {
                    return ObjectId(item._id);
                });

                if (ids && ids.length > 0) {
                    repliesRepository.removeByQuestionAnserIds(ids)
                        .catch(function (error) {
                            console.log(error);
                            log.error(error);
                        })
                        .done();
                }
            }

            questionAnswerRepository.removeByUserId(userId)
                .catch(function (error) {
                    console.log(error);
                    log.error(error);
                })
                .done();
        })
        .catch(function (error) {
            console.log(error);
            log.error(error);
        })
        .done();

    questionAnswerRepository.removeFollowUsersByUserId(userId)
        .catch(function (error) {
            console.log(error);
            log.error(error);
        })
        .done();

    repliesRepository.removeByUserId(userId)
        .catch(function (error) {
            console.log(error);
            log.error(error);
        })
        .done();
}

function deleteFile(path) {
    fs.unlink(path, function (error) {
        if (error) {
            console.log(error);
            log.error(error);
        }

        console.log(`Deleted ${path}`);
    });
}

module.exports = {
    removeQuestionAnswers: removeQuestionAnswers,
    deleteFile: deleteFile
}