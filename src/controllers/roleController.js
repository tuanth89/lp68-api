"use strict";

const RoleRepo = require('../repository/roleRepository');
const StringService = require('../services/stringService');


/**
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function create(req, res, next) {
    let data = req.body || {};
    data.name = StringService.stripHtmlTag(data.name);
    if (!data.friendlyName)
        data.friendlyName = StringService.getUrlFriendlyString(data.name);

    RoleRepo.save(data)
        .then((result) => {
            res.send(result);
            next();
        })
        .catch((error) => {
            return next(error);
        });
}

/**
 * @param {*}
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getList(req, res, next) {
    let filter = req.params;
    RoleRepo.getList(filter)
        .then((data) => {
            res.send(data);
            next();
        })
        .catch((error) => {
            return next(error);
        });
}

/**
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

function listRole(req, res, next) {
    RoleRepo.getListRole()
        .then((data) => {
            res.send(data);
            next();
        })
        .catch((error) => {
            return next(error);
        });
}

/**
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function update(req, res, next) {
    let data = req.body || {}
    let friendlyName = req.params.friendlyName;

    if (data.name) {
        data.name = StringService.stripHtmlTag(data.name);
    }

    if (data.friendlyName)
        data.friendlyName = StringService.stripHtmlTag(data.friendlyName);

    RoleRepo.update(friendlyName, data)
        .then((result) => {
            res.send(result);
            next();
        })
        .catch((err) => {
            res.send(err);
            next();
        });
}


/**
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function remove(req, res, next) {
    let friendlyName = req.params.friendlyName;
    RoleRepo.remove(friendlyName)
        .then((deleted) => {
            res.send(deleted);
            next();
        })
        .catch((error) => {
            return next(error);
        });
}

/**
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getByFriendlyName(req, res, next) {

    RoleRepo.findByFriendlyName(req.params.friendlyName)
        .then(result => {
            res.send(result);
            next();
        })
        .catch((error) => {
            return next(error);
        }).done();
}


module.exports = {
    listRole: listRole,
    getList,
    create,
    update,
    remove,
    getByFriendlyName
};