const _ = require('lodash');
const errors = require('restify-errors');
const {
    to
} = require('../services/utilService');
const {
    ROLE_ACCOUNTANT
} = require('../constant/userConstant');
const User = require('../models/user');
const Serializer = require('../serializers/user');
const StringService = require('../services/stringService');
const HashService = require('../services/hashService');

exports.save = async data => {
    let user = new User(data);

    if (!user.password || !user.email) {
        throw new errors.InvalidContentError('"password" và "email" không được để trống!');
    }

    let hashed = HashService.saltHashPassword(user.password);

    user.password = hashed.passwordHash;
    user.salt = hashed.salt;

    if (user.enabled) {
        user.activateToken = "";
        user.activateTokenDate = new Date()
    } else {
        user.activateToken = uuid.v4();
        user.activateTokenDate = moment().add(1, "days");
    }

    if (!user.name) {
        user.name = user.email;
    }

    if (!user.username) {
        let error;

        let username;
        [error, username] = await to(generateUsername(user.name));
        if (error) {
            throw new errors.InvalidContentError(error.message);
        }

        user.username = username;

        [error, user] = await to(user.save());
        if (error) {
            if (error.code) {
                if (error.code === 11000) {
                    let errorMessage = error.message;

                    if (errorMessage.indexOf('email') > -1) {
                        throw (new errors.InvalidContentError('Email đã tồn tại!'));
                    }
                }
            } else {
                let dataErrors = error.errors;
                let message = "";

                for (var key in dataErrors) {
                    var value = dataErrors[key];
                    message = value.message;
                }

                throw new errors.InvalidContentError(message);
            }
        }

        return user;
    } else {
        let [error, user] = await to(user.save());
        if (error) {
            if (error.code) {
                if (error.code === 11000) {
                    let errorMessage = error.message;

                    if (errorMessage.indexOf('email') > -1) {
                        return new errors.InvalidContentError('Email đã tồn tại!');
                    }
                }
            } else {
                let dataErrors = error.errors;
                let message = "";

                for (let key in dataErrors) {
                    let value = dataErrors[key];
                    message = value.message;
                }

                return new errors.InvalidContentError(message);
            }
        }

        return user;
    }
};

exports.update = async (id, data) => {
    data = _.omit(data, ['createdAt', 'updatedAt', '_id', '__v']);

    if (data.password) {
        let hashed = HashService.saltHashPassword(data.password);
        data.password = hashed.passwordHash;
        data.salt = hashed.salt;
    }

    let user;
    try {
        user = await User.findOneAndUpdate({
            _id: id
        }, data, {
            runValidators: true,
            new: true
        }).select(Serializer.student.summary);
    } catch (error) {
        if (error.code) {
            if (error.code === 11000) {
                let errorMessage = error.message;
                if (errorMessage.indexOf('username') > -1) {
                    throw new errors.InvalidContentError('Tên đăng nhập đã tồn tại!');
                } else if (errorMessage.indexOf('email') > -1) {
                    throw new errors.InvalidContentError('Email đã tồn tại!');
                }
            } else {
                let dataErrors = error.errors;
                let message = "";

                for (let key in dataErrors) {
                    let value = dataErrors[key];
                    message = value.message;
                }

                throw new errors.InvalidContentError(message);
            }
        }
    }

    return user;
};

exports.remove = async id => {
    let [error, student] = await to(User.findOneAndDelete({
        _id: id
    }));

    if (error) {
        throw new errors.InvalidContentError(error.name)
    }

    if (!student) {
        throw new errors.ResourceNotFoundError('The resource you requested could not be found.');
    }

    return true;
};

let countByUsername = async username => {
    let [error, count] = await to(User.count({
        username: new RegExp('^' + username + '(-[0-9]{0,4})?$', "i")
    }));
    if (error) {
        throw new errors.InvalidContentError(error.message)
    }

    return count;
};

let generateUsername = async name => {
    name = StringService.convertViToEn(name);
    name = name.replace(/\s/g, '');

    let [error, count] = await to(countByUsername(name));
    if (error) {
        throw new errors.InvalidContentError(error.message)
    }

    if (count > 0) {
        return `${name}${count}`;
    } else {
        return name;
    }
}