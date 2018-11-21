"use strict";

module.exports = {
    list: '_id name title username roles gender photo enabled email createdAt phone activateToken activateTokenDate expiredAt disableReason creator birthday province district status',
    summary: '_id name username roles gender photo email phone enabled',
    profile: 'province district phone address company receiveNotify experience title biography links name username photo email paymentSetting profileSetting notificationSetting facebookId lang firstName lastName noChangedPwFbGg',
    detail: `_id firstName lastName name username roles photo title address rates rateScore meduRateScore disabledUser disableReason latestViewedCourse email totalTaughtCourses
     students instructorProfile links enabled biography dob gender hometown numberId dateOfIssue placeOfIssue phone salt activateToken facebookId noChangedPwFbGg province experience`,
    findByUsername: `_id name username roles photo title address rates rateScore latestViewedCourse email totalTaughtCourses
     students instructorProfile links enabled biography dob gender hometown numberId dateOfIssue placeOfIssue phone meduRateScore`,
    lecturer: {
        detail: `_id creator name username phone roles photo title address rates rateScore latestViewedCourse email enrolledCourses totalTaughtCourses
        students instructorProfile links enabled biography dob gender hometown numberId dateOfIssue placeOfIssue phone salt activateTokenDate expiredAt`,
        summary: `_id creator name username phone roles photo title address rates rateScore latestViewedCourse email enrolledCourses totalTaughtCourses
        students instructorProfile links enabled biography dob gender hometown numberId dateOfIssue placeOfIssue phone activateTokenDate expiredAt`,
    },
    student: {
        detail: `_id creator name username phone roles photo title address rates rateScore latestViewedCourse email enrolledCourses totalTaughtCourses
        students instructorProfile links enabled biography dob gender hometown numberId dateOfIssue placeOfIssue phone salt activateTokenDate expiredAt`,
        summary: `_id creator name username roles photo title address rates rateScore latestViewedCourse email enrolledCourses totalTaughtCourses
        students instructorProfile links enabled biography dob gender hometown numberId dateOfIssue placeOfIssue phone activateTokenDate expiredAt`,
    },
    active: '_id activateTokenDate name username email',
    resetToken: 'resetTokenExpiredDate',
    register: '_id activateToken name username email enabled disabledUser roles'
};