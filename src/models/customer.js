"use strict";

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');

const UserSchema = new mongoose.Schema({
    address: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    photo: {
        type: String
    },
    phone: {
        type: Number
    },
    /**
     * Số sổ hộ khẩu
     */
    houseHolderNo: {
        type: String,
        trim: true
    },
    /**
     * CMT hoặc căn cước công dân
     */
    numberId: {
        type: String,
        trim: true
    },
    // dateOfIssue: {
    //     type: Date
    // },
    // placeOfIssue: {
    //     type: String,
    //     trim: true
    // },
    imgDocs: {
        type: Array
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
    storeId: {
        type: ObjectId,
        ref: "Store"
    },
    visitor: {
        type: ObjectId,
        ref: "User"
    }
    // creator: {
    //     type: ObjectId,
    //     ref: "User"
    // },
    // lastUserUpdate: {
    //     type: ObjectId,
    //     ref: "User"
    // }
}, {
    minimize: false
});

// UserSchema.index({
//     name: 'text',
//     email: 'text'
// });

UserSchema.plugin(timestamps);

const User = mongoose.model('Customer', UserSchema);

module.exports = User;