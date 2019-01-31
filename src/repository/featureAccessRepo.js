"use strict";

const FeatureAccess = require('../models/featureAccess');
const Q = require("q");
const errors = require('restify-errors');
const ObjectId = require('mongoose').Types.ObjectId;

const _ = require('lodash');

const UserModel = require('../models/user');
/**
 * @param {*} data
 * @returns {*|promise}
 */
function save(data) {
    const def = Q.defer();

    let featureaccess = new FeatureAccess(data);

    featureaccess.save((error) => {
        if (error) {
            def.reject(
                new errors.InvalidContentError(error.message)
            );
        } else {
            def.resolve(200);
        }
    });

    return def.promise;
}


/**
 *
 * @param {}
 * @returns {*|promise}
 */
function getList() {
    const def = Q.defer();

    FeatureAccess
        .find({
            hidden: {
                $ne: true
            }
        })
        .sort({
            priority: 1
        })
        // .populate({
        //     path: 'actions.rolesInfo',
        //     select: 'name friendlyName  description _id'
        // })
        .then(resp => {
            def.resolve(resp);
        }).catch(err => {
        def.reject(err);
    });

    return def.promise;
}


/**
 *
 * @param id
 * @returns {*|promise}
 */
function findById(_id) {
    const def = Q.defer();

    FeatureAccess
        .findOne({
            _id: _id,
            hidden: {
                $ne: true
            }
        })
        .populate({
            path: 'actions.rolesInfo',
            select: 'name friendlyName description _id'
        })
        .then(resp => {
            if (!resp) {
                def.reject(new errors.InvalidContentError(
                    'The resource you requested could not be found.'
                ));
            } else {
                def.resolve(resp);
            }
        })
        .catch(err => {
            def.reject(err.message);
        });

    return def.promise;
}

/**
 *
 * @param friendlyName
 * @returns {*|promise}
 */
function findByFriendlyName(friendlyName) {
    const def = Q.defer();

    FeatureAccess
        .findOne({
            friendlyName: friendlyName
        })
        .populate({
            path: 'actions.rolesInfo',
            select: 'name friendlyName description _id'
        })
        .then(resp => {
            if (!resp) {
                def.reject(new errors.InvalidContentError(
                    'The resource you requested could not be found.'
                ));
            } else {
                def.resolve(resp);
            }
        })
        .catch(err => {
            def.reject(err.message);
        });

    return def.promise;
}


/**
 *
 * @param friendlyName
 * @param data
 * @returns {*|promise}
 */
function update(friendlyName, data) {
    const def = Q.defer();

    let query = {
        friendlyName: friendlyName
    };
    let opts = {
        new: true
    };
    FeatureAccess.findOneAndUpdate(query, data, opts)
        .then(resp => {
            if (!resp)
                def.reject(new errors.InvalidContentError('The resource you requested could not be found.'));
            else
                def.resolve(resp);
        })
        .catch(err => {
            def.reject(new errors.InvalidContentError(err.message));
        });

    return def.promise;
}


/**
 *
 * @param friendlyName
 * @returns {*|promise}
 */
function remove(friendlyName) {
    const def = Q.defer();

    FeatureAccess.findOneAndDelete({
        friendlyName: friendlyName
    })
        .then(resp => {
            if (!resp)
                def.reject(new errors.InvalidContentError('The resource you requested could not be found.'));
            else
                def.resolve(resp);
        })
        .catch(err => {
            def.reject(new errors.InvalidContentError(err.message));
        });

    return def.promise;
}

/**
 *
 * @param {*} routeName
 * @param {*} friendlyName
 * @param {Object} roleName
 * @return {*| promise}
 */
function updateAction(friendlyName, routeName, status, roleName) {
    let def = Q.defer();

    let query = {
        "friendlyName": friendlyName,
        "actions.routeName": routeName
    };
    let opts = {
        new: true
    };
    let update = {};
    if (status == 'push')
        update = {
            $push: {
                "actions.$.roles": roleName
            }
        };
    else
        update = {
            $pull: {
                "actions.$.roles": roleName
            }
        };

    FeatureAccess.findOneAndUpdate(query, update, opts)
        .then(resp => {
            if (!resp)
                def.reject(new errors.InvalidContentError('The resource you requested could not be found.'));
            else
                def.resolve(resp);
        })
        .catch(err => {
            def.reject(new errors.InvalidContentError(err.message));
        });
    return def.promise;
}

/**
 * @param {*} friendlyName
 * @return {* | promise}
 */

function removeRoleAction(friendlyName, roleName) {
    let def = Q.defer();

    let query = {
        friendlyName: friendlyName
    };
    let update = {
        $pull: {
            "actions.$[].roles": roleName
        }

        // $set: {
        //     "actions.$[].roles": []
        // }
    };
    let opts = {
        new: true
    };

    FeatureAccess.findOneAndUpdate(query, update, opts)
        .then(resp => {
            if (!resp)
                def.reject(new errors.InvalidContentError('The resource you requested could not be found.'));
            else
                def.resolve(resp);
        })
        .catch(err => {
            def.reject(new errors.InvalidContentError(err.message));
        });
    return def.promise;
}

/**
 *  @param {Object} data
 *  @param { * | promise }
 */

function addOrUpdate(friendlyName, update) {
    let def = Q.defer();

    let query = {
        friendlyName: friendlyName
    };
    let opts = {
        upsert: true,
        new: true,
        runValidators: true
    };

    FeatureAccess.findOneAndUpdate(query, update, opts)
        .then(resp => {
            def.resolve(resp);
        })
        .catch(err => {
            def.reject(new errors.InvalidContentError(err.message));
        });

    return def.promise;
}

function getFeaturesByRoles(roleNames) {
    let d = Q.defer();
    FeatureAccess.find({
        "actions.roles": {
            $in: roleNames
        }
    }, (err, result) => {
        if (err) {
            d.reject(err);
            return;
        }

        result = result.map(item => {
            let feature = {
                "friendlyName": item.friendlyName,
                routeNames: []
            };


            item.actions.forEach(action => {
                if (action.roles.some(role => {
                        return roleNames.indexOf(role) >= 0
                    })) {
                    feature.routeNames.push(action.routeName);
                }
            });

            return feature;
        })
        d.resolve(result);
    });

    return d.promise;
}

/**
 * Lấy về danh sách notificationType mà người dùng có thể nhận
 */
function getAvailableNotificationTypes(roleNames) {
    let d = Q.defer();
    FeatureAccess.find({
        "actions.roles": {
            $in: roleNames
        }
    }, (err, features) => {
        let notificationTypes = [];
        if (features) {
            features.forEach(item => {
                item.actions.forEach(action => {
                    let hasRoleName = false;
                    action.roles.forEach(roleName => {
                        if (roleNames.indexOf(roleName) >= 0) {
                            hasRoleName = true;
                        }
                    });

                    if (hasRoleName) {
                        if (action.notificationTypes.length > 0) {
                            notificationTypes = _.union(notificationTypes, action.notificationTypes);
                        }
                    }
                })
            });
        }
        d.resolve(notificationTypes);
    })

    return d.promise;
}


/**
 * Check quyền khi truy cập vào 1 route
 */
function checkRoleAccessFreatures(routeNames, roleNames) {
    let def = Q.defer();
    FeatureAccess.find({
        "actions.routeName": {
            $in: routeNames
        },
        "actions.roles": {
            $in: roleNames
        }
    }, (err, resp) => {
        if (err) {
            d.reject(err);
            return;
        }

        if (resp.length > 0) {
            let valid = false;

            for (let a = 0; a < resp.length; a++) {
                let feature = resp[a];

                let actions = feature.actions.filter(i => {
                    return routeNames.indexOf(i.routeName) >= 0;
                });

                for (var i = 0; i < actions.length; i++) {
                    let action = actions[i];
                    if (_.intersection(roleNames, action.roles).length > 0) {
                        valid = true;
                        break;
                    }
                }
            }

            if (valid) {
                def.resolve({
                    flag: true
                });
            } else {
                def.resolve({
                    flag: false
                });
            }
        } else {
            def.resolve({
                flag: false
            });
        }
    });

    return def.promise;
}

/**
 * Lấy về danh sách người dùng có quyền nhận thông tin theo notification type
 */
function getUsersByNotificationType(notificationType) {
    let d = Q.defer();

    FeatureAccess.find({
        "actions.notificationTypes": notificationType
    }, (err, result) => {

        if (err) {
            d.reject(err);
        } else {
            if (!result) d.resolve([]);
            else {
                let roles = [];

                result.forEach(feature => {

                    let actions = feature.actions.filter(i => i.notificationTypes.indexOf(notificationType) >= 0);
                    actions.forEach(a => {
                        roles = _.union(roles, a.roles);
                    });
                });


                UserModel.find({
                    "roles": {
                        $in: roles
                    },
                    "enabled": true
                }).select("_id name username email roles").exec((err, users) => {
                    d.resolve(users);
                })
            }
        }
    })
    return d.promise;
}

/**
 *
 * @param roles
 * @returns {*|promise}
 */
function checkRolePublish(roles) {
    const def = Q.defer();

    let query = [
        {
            $match: {friendlyName: "course"}
        }
        , {
            $project: {
                _id: 1,
                name: 1,
                friendlyName: 1,
                actionRoles: {
                    "$filter": {
                        "input": "$actions",
                        "as": "actions",
                        "cond": {"$eq": ["$$actions.routeName", "course.publish"]}
                    }
                }
            }
        }
        , {
            $project: {
                _id: 1,
                name: 1,
                friendlyName: 1,
                actionRole: {$arrayElemAt: ["$actionRoles", 0]}
            }
        }
        , {
            $project: {
                _id: 1,
                name: 1,
                friendlyName: 1,
                roles: "$actionRole.roles",
                routeName: "$actionRole.routeName"
            }
        },
        {
            $match: {roles: {$in: roles}}
        }
    ];

    FeatureAccess
        .aggregate(query)
        .then(resp => {
            def.resolve(resp);
        })
        .catch(err => {
            def.reject(err.message);
        });

    return def.promise;
}

module.exports = {
    getList: getList,
    save: save,
    findById: findById,
    update: update,
    remove: remove,
    updateAction: updateAction,
    removeRoleAction: removeRoleAction,
    addOrUpdate: addOrUpdate,
    findByFriendlyName: findByFriendlyName,
    getFeaturesByRoles,
    getAvailableNotificationTypes,
    checkRoleAccessFreatures,
    getUsersByNotificationType,
    checkRolePublish
};