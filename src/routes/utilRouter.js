"use strict";

const errors = require('restify-errors');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const AuthorizationService = require('../services/authorizationService');
const config = require('../../config');
const uuid = require('uuid');
const log = require('../../logger').log;

module.exports = server => {

    /**
     *
     */
    server.post('/api/v1/uploadFiles', upload.single('file'), (req, res, next) => {
        try {
            let user = AuthorizationService.getUser(req);
            let username, newImagePath, newVideoPath, today = new Date(),
                files = [];

            if (user) {
                username = user.username;
            } else username = 'anonymous';
            for (let item in req.files) {
                switch (item) {
                    case 'file':
                    case 'image':
                        newImagePath = path.join(__basedir, '/upload/', username, '/', today.getFullYear().toString(), '/', (today.getMonth() + 1).toString(), '/', today.getDate().toString());

                        mkdirp(newImagePath, function (err) {
                            if (err) {
                                log.error(err);
                                return next(err);
                            } else {
                                try {
                                    handleFile(item, req.files[item], newImagePath, username, req.params.course, req.params.type, files, res, next);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        });

                        break;
                    case 'video':
                        newVideoPath = path.join(__basedir, '/upload/video/', username);
                        mkdirp(newVideoPath, function (err) {
                            if (err) {
                                log.error(err);
                                return next(err);
                            } else {
                                handleVideoFile(item, req.files[item], newVideoPath, username, req.params.course, files, res, next);
                            }
                        });
                        break;
                }
            }
        } catch (err) {
            console.log(err);
        }
    });

    /**
     * crop image.
     */
    server.post('/api/v1/crop-image', function (req, res, next) {
        let user = AuthorizationService.getUser(req);

        if (!user) {
            return next(
                new errors.UnauthorizedError("No token provided or token expired !")
            );
        }

        let username, today = new Date();

        if (user) {
            username = user.username;
        } else username = 'anonymous';

        let newImagePath = path.join(__basedir, '/upload/', username, '/', today.getFullYear().toString(),
            '/', (today.getMonth() + 1).toString(), '/', today.getDate().toString());

        let data = req.body;
        let source = data.url.replace(config.domain, __basedir);
        let ext = path.extname(source);
        let destination = path.join(newImagePath, '/', uuid.v4() + ext);
        let width = data.width;
        let height = data.height;
        let x = data.x;
        let y = data.y;
        let infoCrop = `${width}x${height}+${x}+${y}`;

        im.convert([source, '-crop', infoCrop, destination],
            function (err, result) {
                if (err) {
                    log.error(err);

                    return next(err);
                } else {
                    EventDispatcher.deleteFileEvent(source);

                    res.send(200, {
                        url: destination.replace(__basedir, config.domain)
                    });

                    next();
                }
            });
    });

};