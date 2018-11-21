"use strict";

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');
const validate = require('mongoose-validator');
const mongoosePaginate = require('mongoose-paginate');

const nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [2, 65],
        message: 'Họ tên không được ít hơn {ARGS[0]} ký tự và không được vượt quá {ARGS[1]} ký tự.'
    })
];

const UserSchema = new mongoose.Schema({
    creator: {
        type: ObjectId,
        required: false,
        ref: 'User'
    },
    address: {
        type: String,
        default: '',
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: [true, 'Email không được bỏ trống'],
        unique: true
    },

    enabled: {
        type: Boolean,
        default: false
    },
    /**
     * Lý do khóa tài khoản
     */
    disableReason: {
        type: String
    },
    /**
     * Thời gian ngừng hoạt động
     */
    expiredAt: {
        type: Date
    },
    name: {
        type: String,
        default: '',
        trim: true,
        validate: nameValidator
    },
    password: {
        type: String,
        required: [true, 'Password không được bỏ trống']
    },
    photo: {
        type: String,
        default: '',
    },
    phone: {
        type: String
    },
    salt: {
        type: String
    },
    username: {
        type: String,
        validate: {
            validator: function (v) {
                // return /[a-zA-Z0-9]+[a-zA-Z0-9_\.]/.test(v);
                return /^[a-zA-Z0-9.\-_$@*!]*$/.test(v);
            },
            message: 'Tên đăng nhập bao gồm: chữ cái không dấu, chữ số, dấu gạch chân và dấu chấm.'
        },
        required: true,
        unique: true,
        trim: true
    },
    birthday: {
        type: Date
    },
    /**
     * 0: Nữ, 1: Nam | Mặc định là nam
     */
    gender: {
        type: Number,
        default: 1
    },
    hometown: {
        type: String
    },
    numberId: {
        type: String
    },
    dateOfIssue: {
        type: Date
    },
    placeOfIssue: {
        type: String
    },
    /**
     * Chức vụ
     */
    position: {
        type: String,
        trim: true
    },
    /**
     * Kinh nghiệm
     */
    experience: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    province: {
        type: Mixed
    },
    district: {
        type: Mixed
    },
    lang: {
        type: String,
        default: 'vi'
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    minimize: false
});

//Trạng thái của học viên: 1: Chưa kích hoạt, 2: Hoạt động, 3: Bị khóa
UserSchema.virtual('status').get(function () {
    if (this.activateToken != "" && this.enabled == false) return 1;

    if (this.enabled) return 2;

    if (this.enabled == false && this.activateToken == "") {
        return 3;
    }
});

UserSchema.index({
    name: 'text',
    username: 'text',
    phone: 'text',
    email: 'text',
    disableReason: 'text'
});

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);

module.exports = User;