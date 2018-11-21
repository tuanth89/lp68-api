"use strict";

const config = require('../../config');
const errors = require('restify-errors');

module.exports = function(req, res, next) {
    // Implement the middleware function based on the options object
    if(!req.is('application/json') && req.method !== 'GET' && req.method !== 'DELETE' && config.non_json_route.indexOf(req.path()) === -1) {
        return next(
            new errors.InvalidContentError("Expects 'application/json' Content-Type")
        );
    }

    next()
};

