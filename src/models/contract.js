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
        type: String,
        unique: true,
        required: false
    },
    noIdentity: {
        type: Number
    },
    /**
     * Lịch sử hợp đồng (_id contracts)
     */
    contractHistory: {
        type: Array
    },
    // contractDate: {
    //     type: Date
    // },
    customer: {
        type: Mixed
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

    // /**
    //  * Số tiền thực đóng hàng ngày.
    //  */
    // dailyMoney: {
    //     type: Number
    // },
    // /**
    //  * Số tiền thực đã nhập (hoặc chọn).
    //  */
    // dailyMoneyPick: {
    //     type: Number
    // },
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
    note: {
        type: String
    },
    status: {
        type: Number,
        enum: CONTRACT_CONST,
        default: CONTRACT_CONST.NEW,
        required: true
    },
    creator: {
        type: ObjectId
    },
    lastUserUpdate: {
        type: ObjectId
    }
}, {
    minimize: false
});

// ContractSchema.index({
//     phone: 'text',
//     email: 'text',
//     disableReason: 'text'
// });

ContractSchema.plugin(timestamps);
ContractSchema.plugin(mongooseStringQuery);
// ContractSchema.plugin(autoIncrement.plugin, { model: 'Contract', field: 'noIdentity' });

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;