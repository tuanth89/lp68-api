"use strict";

const jwt = require('jsonwebtoken');
const config = require('../../config');
const fs = require('fs');
const role = require('../constant/userConstant');

/**
 * check if a user is authenticated and have rights to take the action
 *
 * @param currentUser
 * @param username
 * @returns {boolean}
 */
function isAuthorized(currentUser, username) {
    if (typeof currentUser !== 'object') {
        return false;
    }

    if (
        !currentUser.hasOwnProperty('id') ||
        !currentUser.hasOwnProperty('username') ||
        !currentUser.hasOwnProperty('email') ||
        !currentUser.hasOwnProperty('userRoles')
    ) {
        return false;
    }

    let userRoles = currentUser.userRoles;

    if (!userRoles instanceof Array) {
        return false;
    }

    // user has ROLE_ADMIN
    if (userRoles.indexOf(role.ROLE_ADMIN) !== -1) {
        return true;
    }

    if (userRoles.indexOf(role.ROLE_ROOT) !== -1) {
        return true;
    }

    if (currentUser.username === username) {
        if (userRoles.indexOf(role.ROLE_CONTENT_MANAGER) !== -1) {
            return true;
        }

        if (userRoles.indexOf(role.ROLE_ACCOUNTANT) !== -1) {
            return true;
        }

        if (userRoles.indexOf(role.ROLE_CUSTOMER_MANAGER) !== -1) {
            return true;
        }

        if (userRoles.indexOf(role.ROLE_STUDENT) !== -1) {
            return true;
        }


        if (userRoles.indexOf(role.ROLE_LECTURER) !== -1) {
            return true;
        }

        if (userRoles.indexOf(role.ROLE_LECTURER_MANAGER) !== -1) {
            return true;
        }
    }

    return false;
}

/**
 * kiểm tra user có quyền ADMIN hay không dựa vào token họ cung cấp
 *
 * @param currentUser
 * @returns {boolean}
 */
function isAdmin(currentUser) {
    if (typeof currentUser !== 'object') {
        return false;
    }

    if (
        !currentUser.hasOwnProperty('id') ||
        !currentUser.hasOwnProperty('username') ||
        !currentUser.hasOwnProperty('email') ||
        !currentUser.hasOwnProperty('userRoles')
    ) {
        return false;
    }

    let userRoles = currentUser.userRoles;

    if (!userRoles instanceof Array) {
        return false;
    }

    if (currentUser.userRoles.indexOf(role.ROLE_ADMIN) !== -1) {
        return true;
    }

    return false;
}

/**
 * kiểm tra user có quyền ADMIN hay không dựa vào token họ cung cấp
 *
 * @param currentUser
 * @returns {boolean}
 */
function isRoot(currentUser) {
    if (typeof currentUser !== 'object') {
        return false;
    }

    if (
        !currentUser.hasOwnProperty('id') ||
        !currentUser.hasOwnProperty('username') ||
        !currentUser.hasOwnProperty('email') ||
        !currentUser.hasOwnProperty('userRoles')
    ) {
        return false;
    }

    let userRoles = currentUser.userRoles;

    if (!userRoles instanceof Array) {
        return false;
    }

    if (currentUser.userRoles.indexOf(role.ROLE_ROOT) !== -1) {
        return true;
    }

    return false;
}

/**
 * kiểm tra user có quyền STUDENT hay không dựa vào token họ cung cấp
 *
 * @param currentUser
 * @returns {boolean}
 */
function isStudent(currentUser) {
    if (typeof currentUser !== 'object') {
        return false;
    }

    if (
        !currentUser.hasOwnProperty('id') ||
        !currentUser.hasOwnProperty('username') ||
        !currentUser.hasOwnProperty('email') ||
        !currentUser.hasOwnProperty('userRoles')
    ) {
        return false;
    }

    let userRoles = currentUser.userRoles;

    if (!userRoles instanceof Array) {
        return false;
    }

    if (currentUser.userRoles.indexOf(role.ROLE_STUDENT) !== -1) {
        return true;
    }

    return false;
}

/**
 *
 * @param req
 * @returns {null}
 */
function getUser(req) {
    let authorization = req.header('Authorization');
    if (!authorization) {
        return null;
    }

    let token = authorization.split(' ')[1];
    if (!token) {
        return null;
    }

    let publicKey;
    try{
        publicKey = fs.readFileSync(config.jwt.public_key);
    }
    catch(e){
        console.log(e);
    }

    return jwt.verify(token, publicKey, function (error, user) {
        if (error) {
            console.log(error);
            return null;
        }

        return user;
    });
}

module.exports = {
    isAuthorized: isAuthorized,
    isAdmin: isAdmin,
    isRoot: isRoot,
    isStudent: isStudent,
    getUser: getUser,
};
