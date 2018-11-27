"use strict";

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');
const validate = require('mongoose-validator');

const StoreSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.SchemaTypes.Email,
        required: [true],
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    province: {
        type: Mixed
    },
    district: {
        type: Mixed
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    minimize: false
});

StoreSchema.plugin(timestamps);

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;