"use strict";

const events = require('events');
const eventEmitter = new events.EventEmitter();
const NewUserListener = require('./listeners/newUserListener');
const LectureChangeListener = require('./listeners/lectureChangeListener');
const SectionChangeListener = require('./listeners/sectionChangeListener');
const CourseRateChangeListener = require('./listeners/courseRateChangeListener');
const SubscribeCourseChangeListener = require('./listeners/subscribeCourseChangeListener');
const QuestionChangeListener = require('./listeners/questionChangeListener');
const AnswerChangeListener = require('./listeners/answerChangeListener');
const CourseChangeListener = require('./listeners/courseChangeListener');
const shoppingCartChangeListener = require('./listeners/shoppingCartChangeListener');
const QuizStatChangeListener = require('./listeners/quizStatChangeListener');
const CertificateChangeListener = require('./listeners/certificateChangeListener');
const SubcategoryChangeListener = require('./listeners/subcategoryChangeListener');
const TopicChangeListener = require('./listeners/topicChangeListener');
const UserChangeListener = require('./listeners/userChangeListener');
const OrderChangeListener = require('./listeners/orderChangeListener');
const LectureHistoryChangeListener = require('./listeners/lectureHistoryChangeListener');

function newUserEvent(name, email) {
    eventEmitter.once('ATI_NEW_USER_CREATED', NewUserListener.newUserListener);

    eventEmitter.emit('ATI_NEW_USER_CREATED', name, email);
}

function updateInstructorEvent(instructor) {
    eventEmitter.once('ATI_INSTRUCTOR_UPDATED', NewUserListener.updateInstructor);

    eventEmitter.emit('ATI_INSTRUCTOR_UPDATED', instructor);
}

function updateInstructorTopicEvent(course) {
    eventEmitter.once('ATI_INSTRUCTOR_TOPIC_UPDATED', NewUserListener.updateInstructorTopic);

    eventEmitter.emit('ATI_INSTRUCTOR_TOPIC_UPDATED', course);
}

function newLectureEvent(lecture) {
    eventEmitter.once('ATI_NEW_LECTURE_CREATED', LectureChangeListener.updateCurriculum);

    eventEmitter.emit('ATI_NEW_LECTURE_CREATED', lecture);
}

function removeLectureEvent(lecture) {
    eventEmitter.once('ATI_LECTURE_REMOVED', LectureChangeListener.reorderAfterRemove);

    eventEmitter.emit('ATI_LECTURE_REMOVED', lecture);
}

function updateLectureEvent(lecture) {
    eventEmitter.once('ATI_LECTURE_UPDATED', LectureChangeListener.updateCurriculum);

    eventEmitter.emit('ATI_LECTURE_UPDATED', lecture);
}

function newQuestionStatEvent(lectureId, questionId) {
    eventEmitter.once('ATI_QUIZ_STAT_UPDATED', QuizStatChangeListener.updateQuizStat);

    eventEmitter.emit('ATI_QUIZ_STAT_UPDATED', lectureId, questionId);
}

function removeQuestionStatByLectureEvent(lectureId) {
    eventEmitter.once('ATI_QUIZ_STAT_REMOVE', QuizStatChangeListener.removeByLecture);

    eventEmitter.emit('ATI_QUIZ_STAT_REMOVE', lectureId);
}

function removeQuestionStatEvent(lectureId, questionId) {
    eventEmitter.once('ATI_QUIZ_STAT_REMOVE', QuizStatChangeListener.remove);

    eventEmitter.emit('ATI_QUIZ_STAT_REMOVE', lectureId, questionId);
}

function newSectionEvent(section) {
    eventEmitter.once('ATI_NEW_SECTION_CREATED', SectionChangeListener.updateCurriculum);

    eventEmitter.emit('ATI_NEW_SECTION_CREATED', section);
}

function removeSectionEvent(section) {
    eventEmitter.once('ATI_SECTION_REMOVED', SectionChangeListener.reorderAfterRemove);

    eventEmitter.emit('ATI_SECTION_REMOVED', section);
}

function newCourseRateCreatedEvent(course, student) {
    eventEmitter.once('ATI_NEW_COURSE_RATE_CREATED', CourseRateChangeListener.createNotification);

    eventEmitter.emit('ATI_NEW_COURSE_RATE_CREATED', course, student);
}

function updateCourseRateEvent(courseId, type) {
    eventEmitter.once('ATI_NEW_COURSE_RATE_CREATED', CourseRateChangeListener.updateCourseRate);

    eventEmitter.emit('ATI_NEW_COURSE_RATE_CREATED', courseId, type);
}

function updateSectionEvent(section) {
    eventEmitter.once('ATI_SECTION_UPDATED', SectionChangeListener.updateCurriculum);

    eventEmitter.emit('ATI_SECTION_UPDATED', section);
}

function updateSubcategoryEvent(category) {
    eventEmitter.once('ATI_SUBCATEGORY_UPDATED', SubcategoryChangeListener.updateSubcategories);

    eventEmitter.emit('ATI_SUBCATEGORY_UPDATED', category);
}

function updateTopicEvent(subcategory) {
    eventEmitter.once('ATI_TOPIC_UPDATED', TopicChangeListener.updateTopics);

    eventEmitter.emit('ATI_TOPIC_UPDATED', subcategory);
}

function newSubscribeCourseEvent(course) {
    eventEmitter.once('ATI_NEW_SUBSCRIBED_COURSE_CREATED', SubscribeCourseChangeListener.createNotification);

    eventEmitter.emit('ATI_NEW_SUBSCRIBED_COURSE_CREATED', course);
}

function newUserFinalExamEvent(courseId, subscribeCourseId) {
    eventEmitter.once('ATI_NEW_USER_FINALEXAM_CREATED', SubscribeCourseChangeListener.randomQuestionFinalExam);

    eventEmitter.emit('ATI_NEW_USER_FINALEXAM_CREATED', courseId, subscribeCourseId);
}

function newQuestionEvent(user, course) {
    eventEmitter.once('ATI_NEW_QUESTION_CREATED', QuestionChangeListener.createNotification);

    eventEmitter.emit('ATI_NEW_QUESTION_CREATED', user, course);
}

function newQuestionReplyEvent(user, questionId) {
    eventEmitter.once('ATI_NEW_QUESTION_REPLY_CREATED', AnswerChangeListener.createNotification);

    eventEmitter.emit('ATI_NEW_QUESTION_REPLY_CREATED', user, questionId);
}

function updateCoursePriceEvent(course) {
    eventEmitter.once('ATI_COURSE_PRICE_UPDATED', CourseChangeListener.priceUpdated);

    eventEmitter.emit('ATI_COURSE_PRICE_UPDATED', course);
}

function updateCourseThumbnailEvent(course) {
    eventEmitter.once('ATI_COURSE_THUMBNAIL_UPDATED', CourseChangeListener.thumbnailUpdated);

    eventEmitter.emit('ATI_COURSE_THUMBNAIL_UPDATED', course);
}

function updateCourseContentEvent(course) {
    eventEmitter.once('ATI_COURSE_CONTENT_UPDATED', CourseChangeListener.contentUpdated);

    eventEmitter.emit('ATI_COURSE_CONTENT_UPDATED', course);
}

function quizMaximumRetryExceededEvent(subscribeCourse) {
    eventEmitter.once('ATI_QUIZ_MAXIMUM_RETRY_EXCEEDED', QuizChangeLdeletePhotoistener.resetLearnProgress);

    eventEmitter.emit('ATI_QUIZ_MAXIMUM_RETRY_EXCEEDED', subscribeCourse);
}

function newCertificateEvent(path, userId, course, codeNumber) {
    eventEmitter.once('ATI_NEW_CERTIFICATE', CertificateChangeListener.createNewCertificate);

    eventEmitter.emit('ATI_NEW_CERTIFICATE', path, userId, course, codeNumber);
}

function newCourseEvent(course) {
    eventEmitter.once('ATI_NEW_COURSE', CourseChangeListener.updateTotalCourse);

    eventEmitter.emit('ATI_NEW_COURSE', course);
}

function totalTaughtCourseChangeEvent(course) {
    eventEmitter.once('ATI_TOTAL_TAUGHT_COURSE_CHANGED', CourseChangeListener.updateTotalTaughtCourse);

    eventEmitter.emit('ATI_TOTAL_TAUGHT_COURSE_CHANGED', course);
}

function totalStudentChangeEvent(user) {
    eventEmitter.once('ATI_TOTAL_STUDENT_CHANGED', CourseChangeListener.updateTotalStudent);

    eventEmitter.emit('ATI_TOTAL_STUDENT_CHANGED', user);
}

function userDeleteEvent(userId) {
    eventEmitter.once('ATI_USER_DELETE', UserChangeListener.removeQuestionAnswers);

    eventEmitter.emit('ATI_USER_DELETE', userId);
}

function deleteFileEvent(path) {
    eventEmitter.once('ATI_USER_PHOTO_DELETE', UserChangeListener.deleteFile);

    eventEmitter.emit('ATI_USER_PHOTO_DELETE', path);
}

function sendEmail(data, email, title, path) {
    eventEmitter.once('ATI_SEND_EMAIL_FOR_ADMIN', OrderChangeListener.sendEmail);

    eventEmitter.emit('ATI_SEND_EMAIL_FOR_ADMIN', data, email, title, path);
}

function createNewShipCode(order, orderDetail, code) {
    eventEmitter.once('ATI_CREATE_NEW_SHIP_CODE', OrderChangeListener.createNewShipCode);

    eventEmitter.emit('ATI_CREATE_NEW_SHIP_CODE', order, orderDetail, code);
}

function updateShipCode(id) {
    eventEmitter.once('ATI_UPDATE_SHIP_CODE', OrderChangeListener.updateShipCode);

    eventEmitter.emit('ATI_UPDATE_SHIP_CODE', id);
}

function updateUsedCountOfGalleryEvent(id) {
    eventEmitter.once('ATI_SEND_EMAIL_FOR_ADMIN', CourseChangeListener.updateUsedCountOfGallery);

    eventEmitter.emit('ATI_SEND_EMAIL_FOR_ADMIN', id);
}

function sendNotifyApprovalCourse(req, user, course) {
    eventEmitter.once('ATI_SEND_APPROVE_COURSE', CourseChangeListener.sendNotifyApprovalCourse);

    eventEmitter.emit('ATI_SEND_APPROVE_COURSE', req, user, course);
}


function updateShoppingCartDiscountEvent(discounts, cart_id, courses) {
    eventEmitter.once('UPDATE_SHOPPING_CART_DISCOUNT', shoppingCartChangeListener.updateShoppingCartDiscount);

    eventEmitter.emit('UPDATE_SHOPPING_CART_DISCOUNT', discounts, cart_id, courses);
}

function updateSectionSelectedEvent(subscribeCourse) {
    eventEmitter.once('UPDATE_SECTION_SELECTED_EVENT', SubscribeCourseChangeListener.updateSectionSelected);

    eventEmitter.emit('UPDATE_SECTION_SELECTED_EVENT', subscribeCourse);
}

function updateTotalVideoTimeEvent(oldData, newData, courseFriendlyName) {
    eventEmitter.once('UPDATE_TOTAL_VIDEO_TIME_EVENT', LectureHistoryChangeListener.updateTotalVideoTime);

    eventEmitter.emit('UPDATE_TOTAL_VIDEO_TIME_EVENT', oldData, newData, courseFriendlyName);
}

module.exports = {
    newUserEvent: newUserEvent,
    updateInstructorEvent: updateInstructorEvent,
    newLectureEvent: newLectureEvent,
    removeLectureEvent: removeLectureEvent,
    newCertificateEvent: newCertificateEvent,
    updateLectureEvent: updateLectureEvent,
    newSectionEvent: newSectionEvent,
    removeSectionEvent: removeSectionEvent,
    updateSectionEvent: updateSectionEvent,
    updateCoursePriceEvent: updateCoursePriceEvent,
    updateCourseThumbnailEvent: updateCourseThumbnailEvent,
    updateCourseContentEvent: updateCourseContentEvent,
    updateCourseRateEvent: updateCourseRateEvent,
    newSubscribeCourseEvent: newSubscribeCourseEvent,
    newQuestionEvent: newQuestionEvent,
    newQuestionReplyEvent: newQuestionReplyEvent,
    newCourseRateCreatedEvent: newCourseRateCreatedEvent,
    quizMaximumRetryExceededEvent: quizMaximumRetryExceededEvent,
    newCourseEvent: newCourseEvent,
    updateSubcategoryEvent: updateSubcategoryEvent,
    updateTopicEvent: updateTopicEvent,
    totalTaughtCourseChangeEvent: totalTaughtCourseChangeEvent,
    totalStudentChangeEvent: totalStudentChangeEvent,
    updateInstructorTopicEvent: updateInstructorTopicEvent,
    newQuestionStatEvent: newQuestionStatEvent,
    removeQuestionStatByLectureEvent: removeQuestionStatByLectureEvent,
    removeQuestionStatEvent: removeQuestionStatEvent,
    userDeleteEvent: userDeleteEvent,
    deleteFileEvent: deleteFileEvent,
    newUserFinalExamEvent: newUserFinalExamEvent,
    sendEmail: sendEmail,
    createNewShipCode: createNewShipCode,
    updateShipCode: updateShipCode,
    updateShoppingCartDiscountEvent: updateShoppingCartDiscountEvent,
    updateUsedCountOfGalleryEvent: updateUsedCountOfGalleryEvent,
    sendNotifyApprovalCourse: sendNotifyApprovalCourse,
    updateSectionSelectedEvent: updateSectionSelectedEvent,
    updateTotalVideoTimeEvent: updateTotalVideoTimeEvent
};