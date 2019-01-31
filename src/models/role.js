"use strict";

const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const mongooseStringQuery = require("mongoose-string-query");

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Tên nhóm quyền không được bỏ trống"],
        // maxlength: [25, "Chỉ được phép nhập tối đa 25 ký tự"],
        unique: true
    },
    friendlyName: {
        type: String,
        required: true,
        unique: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    //Mô tả nhóm quyền
    description: {
        type: String,
        // maxlength: [250, "Chỉ được phép nhập tối đa 250 ký tự"]
    }
}, {
    minimize: false
});

RoleSchema.index({
    name: "text"
});

RoleSchema.plugin(timestamps);
RoleSchema.plugin(mongooseStringQuery);

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;