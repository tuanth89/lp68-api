"use strict";

const config = require('../../config');
const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
// const autoIncrement = require('mongoose-auto-increment');
const timestamps = require('mongoose-timestamp');
const Mixed = mongoose.Schema.Types.Mixed;
const ObjectId = mongoose.Schema.Types.ObjectId;
require('mongoose-type-email');
const CONTRACT_CONST = require('../constant/contractConstant');
const CONTRACT_OTHER_CONST = require('../constant/contractOtherConstant');

// let connection = null;
//
// if (config.db.authorizationEnabled) {
//     connection = mongoose.createConnection(config.db.uri, {
//         auth: config.db.auth
//     });
// } else {
//     connection = mongoose.createConnection(config.db.uri);
// }

// autoIncrement.initialize(connection);

const ContractSchema = new mongoose.Schema({
        contractNo: {
            type: String
        },
        storeCode: {
            type: String,
            // required: true
        },
        customerCode: {
            type: String,
            // required: true
        },
        typeCode: {
            type: String,
            enum: [CONTRACT_OTHER_CONST.TYPE_CODE.XUAT_MOI, CONTRACT_OTHER_CONST.TYPE_CODE.XUAT_DAO],
            // required: true
        },
        noIdentity: {
            type: Number
        },
        /**
         * Lịch sử hợp đồng (_id contracts)
         */
        contractHistory: [{
            type: ObjectId,
            ref: "Contract"
        }],
        customer: {
            type: Mixed
        },
        customerId: {
            type: ObjectId,
            ref: "Customer"
        },
        /**
         * Số tiền vay.
         */
        loanMoney: {
            type: Number
        },
        /**
         * Số thực thu (Tiền vay + lãi).
         */
        actuallyCollectedMoney: {
            type: Number
        },
        /**
         * Số ngày vay.
         */
        loanDate: {
            type: Number
        },
        /**
         * Số tiền phải đóng hàng ngày (Tự chia theo Tiền thực thu/Số ngày).
         */
        dailyMoneyPay: {
            type: Number
        },
        /**
         * Tổng tiền đã đóng.
         */
        totalMoneyPaid: {
            type: Number,
            default: 0
        },
        /**
         * Số ngày hết hạn vay (Tự động tính theo ngày vay + số ngày vay).
         */
        loanEndDate: {
            type: Date
        },
        /**
         * Ngày hết họ
         */
        contractEndDate: {
            type: Date
        },
        note: {
            type: String
        },
        status: {
            type: Number,
            enum: CONTRACT_CONST,
            default: CONTRACT_CONST.NEW,
            required: true
        },
        // Là khách mới hay cũ
        isCustomerNew: {
            type: Boolean
        },
        commissionFee: {
            type: Mixed
        },
        // Ngày chuyển
        transferDate: {
            type: Date
        },
        // Ngày hẹn
        appointmentDate: {
            type: Date
        },
        // Hẹn đóng
        payMoney: {
            type: Number
        },
        // Thuộc cửa hàng nào
        storeId: {
            type: ObjectId,
            ref: "Store"
        },
        // Người tạo
        creator: {
            type: ObjectId,
            ref: "User"
        },
        lastUserUpdate: {
            type: ObjectId,
            ref: "User"
        }
    }
    , {
        minimize: false
    });

// ContractSchema.index({
//     phone: 'text',
//     email: 'text',
//     disableReason: 'text'
// });

ContractSchema.virtual('totalMoneyNeedPay').get(function () {
    return this.actuallyCollectedMoney - this.totalMoneyPaid;
});

// ContractSchema.virtual('contractNo').get(function () {
//     return `${this.storeCode}/${this.customerCode}/${this.loanDate}/${this.typeCode}/${this.noIdentity}`;
// });

ContractSchema.set('toObject', {getters: true});
ContractSchema.set("toJSON", {getters: true});

ContractSchema.plugin(timestamps);
ContractSchema.plugin(mongooseStringQuery);
// ContractSchema.plugin(autoIncrement.plugin, { model: 'Contract', field: 'noIdentity' });

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;