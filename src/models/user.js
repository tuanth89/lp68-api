"use strict";

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');
const validate = require('mongoose-validator');

const UserSchema = new mongoose.Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: [true, 'Email không được bỏ trống'],
        unique: true
    },
    username: {
        type: String,
        // validate: {
        //     validator: function (v) {
        //         // return /[a-zA-Z0-9]+[a-zA-Z0-9_\.]/.test(v);
        //         return /^[a-zA-Z0-9.\-_$@*!]*$/.test(v);
        //     },
        //     message: 'Tên đăng nhập bao gồm: chữ cái không dấu, chữ số, dấu gạch chân và dấu chấm.'
        // },
        // required: true,
        // unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password không được bỏ trống']
    },
    salt: {
        type: String
    },
    fullName: {
        type: String,
        default: '',
        trim: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    title: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: Number
    },
    photo: {
        type: String
    },
    dateIn: {
        type: Date
    },
    roles: {
        type: Array,
        default: []
    },
    gender: {
        type: Number
    },
    isAccountant: {
        type: Boolean,
        default: false
    }
}, {
    minimize: false
});

// UserSchema.index({
//     name: 'text',
//     email: 'text'
// });

UserSchema.plugin(timestamps);

const User = mongoose.model('User', UserSchema);

module.exports = User;