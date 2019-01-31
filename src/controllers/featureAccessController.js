"use strict";

const FeatureAccessRepo = require('../repository/featureAccessRepo');
const StringService = require('../services/stringService');
const AuthorizationService = require('../services/authorizationService');

/**
 * @param {Object} data
 * @param { * | req | res | next }
 */

function create(req, res, next) {
    let data = req.body || {};
    data.name = StringService.stripHtmlTag(data.name);
    if (!data.friendlyName)
        data.friendlyName = StringService.getUrlFriendlyString(data.name);

    FeatureAccessRepo.save(data)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}

/**
 *  @param {*} filter
 *  @param { * | req | res | next }
 */

function list(req, res, next) {
    FeatureAccessRepo.getList()
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}


/**
 *  @param {*} friendlyName
 *  @param {Object} data
 *  @param { * | req | res | next }
 */
function update(req, res, next) {
    let data = req.body || {}
    let friendlyName = req.params.friendlyName;

    if (data.name)
        data.name = StringService.stripHtmlTag(data.name);

    if (data.friendlyName)
        data.friendlyName = StringService.stripHtmlTag(data.friendlyName);

    FeatureAccessRepo.update(friendlyName, data)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            res.send(err);
            next();
        })
        .done();
}


/**
 * @param {*} _id
 * @param { * | req | res | next }
 */
function remove(req, res, next) {
    let friendlyName = req.params.friendlyName;

    FeatureAccessRepo.remove(friendlyName)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}

/**
 * @param {*} _id
 * @param { * | req | res | next }
 */

function getOne(req, res, next) {
    let friendlyName = req.params.friendlyName;

    FeatureAccessRepo.findByFriendlyName(friendlyName)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}

/**
 * @param {object} { roleId : ObjectId}
 * @param {int} status {-1, 0, 1}
 * @param {string} routeName
 * @param { * | req | res | next }
 */

function updateAction(req, res, next) {
    let data = req.body || {};
    let friendlyName = req.params.friendlyName;
    let routeName = data.routeName;
    let status = data.status;

    FeatureAccessRepo.updateAction(friendlyName, routeName, status, data.roleName)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}

/**
 * @param {object} { roleId : ObjectId}
 * @param {int} status {-1, 0, 1}
 * @param {string} routeName
 * @param { * | req | res | next }
 */

function removeRoleAction(req, res, next) {
    let friendlyName = req.params.friendlyName;
    let roleName = req.params.roleName;

    FeatureAccessRepo.removeRoleAction(friendlyName, roleName)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}

/**
 * Cập nhật hàng loạt featureAccess
 * @param {object} data
 * @param { * | req | res | next }
 */

function addOrUpdate(req, res, next) {
    let data = req.body;
    try {
        if (data.length) {
            data.forEach(feature => {
                let friendlyName = feature.friendlyName;
                FeatureAccessRepo.addOrUpdate(friendlyName, feature)
                    .then((resp) => {

                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .done();
            });
            res.send(201);
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Lấy về danh sách các tính năng của người dùng hiện tại
 */
function getFeaturesByCurrentUser(req, res, next) {
    let user = AuthorizationService.getUser(req);
    FeatureAccessRepo.getFeaturesByRoles(user.userRoles)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}


/**
 * Lấy về danh sách các tính năng được phân quyền theo role
 */
function getFeaturesByRole(req, res, next) {

    FeatureAccessRepo.getFeaturesByRoles([req.params.roleName])
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}

function getUsersByNotificationType(req, res, next) {
    FeatureAccessRepo.getUsersByNotificationType(req.params.notificationType)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}

/**
 * Kiểm tra role từ account có quyền xuất bản khóa học không.
 */
function checkRolePublish(req, res, next) {
    let roles = [];
    if (req.params.roles instanceof Array) {
        roles = req.params.roles;
    }
    else
        roles.push(req.params.roles);

    FeatureAccessRepo.checkRolePublish(roles)
        .then((resp) => {
            res.send(resp);
            next();
        })
        .catch((err) => {
            return next(err);
        })
        .done();
}


module.exports = {
    list: list,
    getOne: getOne,
    create: create,
    update: update,
    remove: remove,
    updateAction: updateAction,
    removeRoleAction: removeRoleAction,
    addOrUpdate: addOrUpdate,
    getFeaturesByCurrentUser,
    getFeaturesByRole,
    getUsersByNotificationType,
    checkRolePublish: checkRolePublish
};