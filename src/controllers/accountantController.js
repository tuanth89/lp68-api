const errors = require('restify-errors');
const EventDispatcher = require('../events/dispatcher');
const StringService = require('../services/stringService');
const _ = require('lodash');
const UserRepository = require('../repository/userRepository');
const AccountRepo = require('../repository/accountRepo');
const config = require('../../config');
const AuthorizationService = require('../services/authorizationService');
const { ROLE_ACCOUNTANT } = require('../constant/userConstant');
const ObjectId = require('mongoose').Types.ObjectId;

function getList(req, res, next) {
    req.params.page = parseInt(req.params.page, 10) || config.pagination.page;
    req.params.per_page = parseInt(req.params.per_page, 10) || config.pagination.limit;

    req.params.role = ROLE_ACCOUNTANT;

    AccountRepo.getList(req.params).then(result => {
        res.send(200, result);
        next();
    }).catch(err => {
        return next(err);
    }).done()
}

function getById(req, res, next) {
    AccountRepo.getById(req.params.id).then(result => {
        if (result.roles.indexOf(ROLE_ACCOUNTANT) < 0) {
            return next(new errors.NotFoundError());
        }
        res.send(200, result);
        next();
    }).catch(err => {
        return next(err);
    }).done();
}

let create = async (req, res, next) => {
    let data = req.body || {};
    data.name = StringService.stripHtmlTag(data.name);
    data.roles = [ROLE_ACCOUNTANT];
    let _user = AuthorizationService.getUser(req);
    data.creator = _user.id;

    let user;
    try {
        user = await UserRepository.save(data);
    } catch (error) {
        return next(error);
    }

    res.send(user);
    next();
};

let update = async (req, res, next) => {
    let data = req.body || {};

    if (!data._id) {
        data = Object.assign({}, data, {
            _id: req.params.id
        });
    }

    let _user = AuthorizationService.getUser(req);

    let user;
    try {
        user = await UserRepository.findById(_user.id);
    } catch (error) {
        return next(new errors.ForbiddenError('Vui lòng đăng nhập'))
    }

    let student;
    try {

        student = await UserRepository.update(data._id, data);
    } catch (error) {
        return next(error);
    }

    res.send(200, student);
    next();
};

let remove = async (req, res, next) => {
    const studentId = req.params.id;

    let student;
    try {
        student = await UserRepository.findById(studentId);
        if (!student || student.roles.indexOf(ROLE_STUDENT) < 0) {
            return next(new errors.ResourceNotFoundError('The resource you requested could not be found.'));
        }
    } catch (error) {
        return next(new errors.InvalidContentError(error.message));
    }

    let deleted;
    try {
        deleted = await UserRepository.remove(studentId);

        if (deleted) {

        }
    } catch (error) {
        return next(error);
    }

    res.send(204, {
        deleted
    });
    next();
};

/**
 * Kích hoạt hoặc tạm dừng tài khoản
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function setActivate(req, res, next) {
    const id = req.params.id;
    let data = req.body || {};
    data = _.pick(data, ['enabled', 'disableReason']);

    if (data.enabled == false) {
        let _user = AuthorizationService.getUser(req);
        data.disabledUser = _user.id;
    }

    AccountRepo.setActivate(id, data)
        .then(user => {
            if (!user.enabled) {
                // Gửi email thông báo cho người dùng,
                let titleEmail = `${user.name} - Tài khoản của bạn đã bị khóa`;

                let dataTemplate = {
                    product: config.email_const.PRODUCT,
                    product_url: config.email_const.PRODUCT_URL,
                    company_name: config.email_const.COMPANY_NAME,
                    company_address: config.email_const.COMPANY_ADDRESS,

                    disable_reason: user.disableReason,
                    account_name: user.name,
                };

                EventDispatcher.sendEmail(dataTemplate, user.email, titleEmail, 'templates/account/lock');
            } else {
                if (user.disableReason) {
                    let titleEmail = "Medu - Thông báo kích hoạt tài khoản bị khóa";

                    let dataTemplate = {
                        product: config.email_const.PRODUCT,
                        product_url: config.email_const.PRODUCT_URL,
                        company_name: config.email_const.COMPANY_NAME,
                        company_address: config.email_const.COMPANY_ADDRESS,

                        account_name: user.name,
                    };

                    EventDispatcher.sendEmail(dataTemplate, user.email, titleEmail, 'templates/account/unlock');
                } else {
                    let dataEmail = {
                        product: config.email_const.PRODUCT,
                        product_url: config.email_const.PRODUCT_URL,
                        name: user.name,
                        company_name: config.email_const.COMPANY_NAME,
                        company_address: config.email_const.COMPANY_ADDRESS,
                        type: NOTIFY_CONST.NOTIFICATION_TYPE_FIRST_LOGIN,
                        user: {
                            _id: user._id,
                            name: user.name,
                            username: user.username,
                            photo: user.photo,
                            userId: ObjectId(user._id)
                        }
                    };

                    EventDispatcher.sendEmailAutoEvent(dataEmail, user.email, config.email_const.EMAIL_FIRST_LOGIN.format(user.name), 'templates/welcome/firstLogin');

                    UserRepository.updateFirstLogin(user._id);
                }
            }

            res.send(user);
            next();
        })
        .catch(err => {
            return next(err);
        })
        .done()
}

module.exports = {
    getList,
    getById,
    create,
    update,
    remove,
    setActivate
}