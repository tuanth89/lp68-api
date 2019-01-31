"use strict";

const Role = require('../models/role');
const Q = require("q");
const errors = require('restify-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const StringService = require('../services/stringService');
const Serializer = require('../serializers/role');


/**
 *
 * @param {*} data
 * @returns {*|promise}
 */
function save(data) {
    const d = Q.defer();

    if (!data.friendlyName) {
        data.friendlyName = StringService.getUrlFriendlyString(data.name);
    }

    let role = new Role(data);

    role.save((err) => {
        if (err) {
            d.reject(
                new errors.InvalidContentError(err.message)
            );
        } else {
            d.resolve(200);
        }
    });

    return d.promise;
}


/**
 *
 * @param {}
 * @returns {*|promise}
 */
function getList(filter) {
    const d = Q.defer();

    let query = {};

    if (filter.search) {
        query = {
            $text: {
                $search: filter.search
            }
        }
    }

    Role
        .find(query)
        .then(resp => {
            d.resolve(resp);
        }).catch(err => {
        d.reject(err);
    });

    return d.promise;
}

/**
 *
 * @returns {*|promise}
 */
function getListRole() {
    const d = Q.defer();

    let query = {friendlyName: {$nin: ["super-admin"]}};
    Role
        .find(query)
        .select(Serializer.detail)
        .then(resp => {
            d.resolve(resp);
        }).catch(err => {
        d.reject(err);
    });

    return d.promise;
}


/**
 *
 * @param _id
 * @returns {*|promise}
 */
function findById(_id) {
    const d = Q.defer();

    Role.findOne({
        _id: _id
    })
        .populate({
            path: 'actions.roles',
            select: ['name', 'description']
        })
        .then(resp => {
            if (!resp) {
                d.reject(new errors.InvalidContentError(
                    'The resource you requested could not be found.'
                ));
            } else {
                d.resolve(resp);
            }
        })
        .catch(err => {
            d.reject(err.message);
        });

    return d.promise;
}


/**
 *
 * @param friendlyName
 * @returns {*|promise}
 */
function findByFriendlyName(friendlyName) {
    const d = Q.defer();

    Role
        .findOne({
            friendlyName: friendlyName
        })
        .populate({
            path: 'actions.roles',
            select: ['name', 'description']
        })
        .then(resp => {
            if (!resp) {
                d.reject(new errors.InvalidContentError(
                    'The resource you requested could not be found.'
                ));
            } else {
                d.resolve(resp);
            }
        })
        .catch(err => {
            d.reject(err.message);
        });

    return d.promise;
}

/**
 *
 * @param friendlyName
 * @param data
 * @returns {*|promise}
 */
function update(friendlyName, data) {
    const d = Q.defer();

    let query = {
        friendlyName: friendlyName
    };
    let opts = {
        new: true
    };
    Role.findOneAndUpdate(query, data, opts)
        .then(resp => {
            if (!resp)
                d.reject(new errors.InvalidContentError('The resource you requested could not be found.'));
            else
                d.resolve(resp);
        })
        .catch(err => {
            d.reject(new errors.InvalidContentError(err.message));
        });

    return d.promise;
}


/**
 *
 * @param friendlyName
 * @returns {*|promise}
 */
function remove(friendlyName) {
    const def = Q.defer();

    Role.findOneAndDelete({
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


module.exports = {
    getListRole: getListRole,
    getList: getList,
    save: save,
    findById: findById,
    update: update,
    remove: remove,
    findByFriendlyName
};