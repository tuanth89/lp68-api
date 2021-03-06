"use strict";

const UserRepository = require('../repository/userRepository');
const HashService = require('../services/hashService');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');
const errors = require('restify-errors');
const UAParser = require('ua-parser-js');
const path = require('path');
const uuid = require('uuid');
const log = require('../../logger').log;

module.exports = function (server) {

    /**
     * @method POST
     * Provided registered credential then get back a token for further access.
     */
    server.post('/api/v1/getToken', (req, res, next) => {
        UserRepository.findByUsernameOrEmail(req.body.username)
            .then(function (user) {
                // if (!user.enabled && user.disabledUser) {
                //     return next(new errors.LockedError('Tài khoản tạm khóa!'));
                // }
                // else if (user.activateToken && !user.enabled) {
                //     return next(new errors.UnauthorizedError('Tài khoản chưa kích hoạt!'));
                // }

                let hashed = HashService.saltHashPassword(req.body.password, user.salt);
                if (hashed.passwordHash === user.password) {
                    const payload = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        photo: user.photo,
                        userRoles: user.roles
                    };

                    let privateKey = fs.readFileSync(__basedir + config.jwt.private_key);

                    jwt.sign(payload, privateKey, {
                        expiresIn: config.jwt.token_expire,
                        algorithm: config.jwt.hash_algorithm
                    }, function (err, token) {
                        if (err) {
                            console.log(err);
                            log.error(err);
                            return next(err);
                        } else {
                            // return the information including token as JSON
                            res.send({
                                id: user._id,
                                username: user.username,
                                userRoles: user.roles,
                                token: token,
                                name: user.name,
                                email: user.email,
                                photo: user.photo,
                                province: user.province,
                                phone: user.phone,
                                address: user.address,
                                firstName: user.firstName,
                                lastName: user.lastName,
                            });
                            next();
                        }
                    });

                } else {
                    // log.error(error);
                    // return next();
                    return next(new errors.ResourceNotFoundError('Thông tin đăng nhập không đúng'));
                }
            })
            .catch(function (error) {
                // log.error(error);
                // return next(new errors.InvalidCredentialsError('Invalid Credentials'));
                log.error(error);
                return next(error);
            })
            .done();
    });

    /**
     * @method POST
     * Check if a token is valid and not yet expire. The token is used to access all other resource in the system
     */
    server.post('/api/v1/checkToken', (req, res, next) => {
        let token = req.header('Authorization', '').split(' ')[1];
        let publicKey;
        try {
            publicKey = fs.readFileSync(config.jwt.public_key);
        } catch (e) {
            console.log(e);
        }

        jwt.verify(token, publicKey, function (error, user) {
            if (error) {
                log.error(error);
                return next(new errors.InvalidCredentialsError('The token is either invalid or expired'))
            } else {
                // author: tienvd. Get data user newest.
                UserRepository.findById(user.id)
                    .then(function (userNewest) {
                        if (!userNewest.enabled) {
                            return next(new errors.NotAuthorizedError('User has not been activated!'));
                        }

                        res.send({
                            id: userNewest._id,
                            username: userNewest.username,
                            token: token,
                            userRoles: userNewest.roles,
                            name: userNewest.name,
                            email: userNewest.email,
                            photo: userNewest.photo,
                            province: userNewest.province,
                            experience: userNewest.experience,
                            phone: userNewest.phone,
                            address: userNewest.address,
                            facebookId: userNewest.facebookId,
                            noChangedPwFbGg: userNewest.noChangedPwFbGg,
                            firstName: userNewest.firstName,
                            lastName: userNewest.lastName,
                        });
                        next();
                    })
                    .catch(function (error) {
                        log.error(error);
                        return next(new errors.InvalidCredentialsError('Invalid Credentials'));
                    })
                    .done();
            }
        });
    });

    /**
     * @method POST
     * create a new account with activate link sent to email.
     */
    server.post('/api/v1/register', (req, res, next) => {
        let data = req.body || {};
        UserRepository.findByEmailActive(data.email)
            .then(function (userFind) {
                if (userFind && req.body.from && req.body.from === 'ui' && userFind.roles.indexOf(UserConstant.ROLE_LECTURER) === -1 && userFind.roles.indexOf(UserConstant.ROLE_STUDENT) === -1) {
                    return next(new errors.ForbiddenError("Access denied!"));
                }

                if (!userFind) {
                    UserRepository.save(data)
                        .then(function (user) {
                            user.isLecture = data.isLecture;
                            EventDispatcher.newUserEvent(user);

                            let parser = new UAParser();
                            parser.setUA(req.headers['user-agent']);
                            let dataEmail = {
                                action_url: config.frontend_domain.concat('activateAccount/', user.activateToken),
                                support_url: config.frontend_domain.concat('activateAccount/', user.activateToken),
                                product: PRODUCT,
                                product_url: "https://medu.vn",
                                live_chat_url: "https://medu.vn/livechat",
                                support_email: "support@medu.vn",
                                name: user.name,
                                operating_system: parser.getOS().name,
                                browser_name: parser.getBrowser().name,
                                company_name: COMPANY_NAME,
                                company_address: COMPANY_ADDRESS
                            };

                            EmailService.sendWithTemplate(
                                'templates/activate',
                                config.mail.from,
                                user.email,
                                "[Medu Elearning] Kích hoạt tài khoản",
                                dataEmail
                            ).then((response) => {
                                res.send(201);
                                next();
                            })
                                .catch((error) => {
                                    log.error(error);
                                    return next(new errors.InternalError(error.message));
                                });

                        })
                        .catch(function (error) {
                            log.error(error);
                            return next(error);
                        });
                }
                else if (!userFind.enabled && userFind.disabledUser) {
                    return next(new errors.LockedError('Tài khoản tạm khóa!'));
                }
                else if (userFind.activateToken && !userFind.enabled) {
                    return next(new errors.UnauthorizedError('Tài khoản chưa kích hoạt!'));
                } else {
                    return next(new errors.InvalidContentError('Email already exists!'));
                }


            })
            .catch(function (error) {
                log.error(error);
                return next(error);
            })
            .done();
    });

};