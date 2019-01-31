/**
 * Quản lý cấu hình truy cập của từng nhóm quyền. Danh sách các tính năng để thiết lập phân quyền cho các nhóm quyền.
 */
"use strict";

const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const mongooseStringQuery = require("mongoose-string-query");

const ObjectId = mongoose.Schema.Types.ObjectId;

const {
    routeNames
} = require("../constant/permission");

const FeatureAccessSchema = new mongoose.Schema({
    //Tên nhóm chức năng, các chức năng sẽ được gom vào theo từng nhóm
    groupName: {
        type: String
    },

    name: {
        type: String,
        required: [true, "Tên hiển thị không được để trống"]
    },

    /**
     * Tên định danh feature
     */
    friendlyName: {
        type: String,
        require: [true, "Tên định danh không được bỏ trống"],
        unique: true
    },

    description: {
        type: String,
        default: ""
    },

    //Thứ tự hiển thị của trang trong nhóm chức năng
    priority: {
        type: Number,
        default: 0
    },

    //Cho biết feature được hiển thị ra ngoài hay không
    hidden: {
        type: Boolean,
        default: false
    },


    /**
     * Danh sách các routeName mà feature này quản lý
     */
    actions: [{
        /*
         *Loại bỏ _Id
         */
        _id: false,

        /**
         * Tên routeName
         */
        routeName: {
            type: String,
            enum: routeNames,
            require: true
        },

        /**
         * Lưu danh sách các role được phép truy cập vào action này
         */
        roles: [{
            type: String
        }]
    }]
}, {
    minimize: false,
    toJSON: {
        virtuals: true
    }
});

FeatureAccessSchema.virtual("actions.rolesInfo", {
    ref: "Role",
    localField: "actions.roles",
    foreignField: "friendlyName",
    justOne: false
});

FeatureAccessSchema.plugin(timestamps);
FeatureAccessSchema.plugin(mongooseStringQuery);

const FeatureAccess = mongoose.model("FeatureAccess", FeatureAccessSchema);
module.exports = FeatureAccess;