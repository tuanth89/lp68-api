"use strict";

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
const mongooseStringQuery = require('mongoose-string-query');

const StoreSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    nameUnsign: {
        type: String,
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    staffs: [{
        type: ObjectId,
        ref: "User"
    }],
    ownStore: {
        type: ObjectId
    },
    accountant: {
        type: ObjectId
    }
}, {
    minimize: false
});

StoreSchema.plugin(timestamps);
StoreSchema.plugin(mongooseStringQuery);

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;