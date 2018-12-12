"use strict";

const HdLuuThong = require('../../models/hdLuuThong');
const CustomerRepository = require('../../repository/customerRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');

function newContractAddedListener(contracts) {
    HdLuuThongRepository.insertMany(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function newContractLuuThongListener(contracts) {
    let luuthongList = [];

    contracts.forEach((contractItem) => {
        let nextPayDate = new Date(contractItem.createdAt);
        nextPayDate.setDate(nextPayDate.getDate() + 1);

        let totalMoneyPaid = contractItem._doc.totalMoneyPaid || 0;
        let dailyMoneyPay = contractItem._doc.dailyMoneyPay || 0;
        let luuthong = new HdLuuThong();
        luuthong.contractId = contractItem.contractId;

        if (totalMoneyPaid > 0) {
            luuthong.moneyHavePay = contractItem.moneyHavePay;
            luuthong.moneyPaid = contractItem.moneyPaid;
        } else {
            luuthong.moneyHavePay = dailyMoneyPay;
            luuthong.moneyPaid = dailyMoneyPay;
        }

        luuthong.createdAt = nextPayDate;
        luuthongList.push(luuthong);
    });

    HdLuuThong.insertMany(luuthongList, function (error, item) {
        if (error) {
            console.error(error);
        } else {

        }
    });
}

function updateAndNewLuuThong(hdLuuThongId, contractNew) {
    let nextPayDate = new Date(contractNew.createdAt);
    nextPayDate.setDate(nextPayDate.getDate() + 1);

    let luuthong = new HdLuuThong();
    luuthong.contractId = contractNew._id;
    luuthong.moneyHavePay = contractNew.dailyMoney;
    luuthong.moneyPaid = contractNew.dailyMoney;
    luuthong.createdAt = nextPayDate;

    HdLuuThong.update({_id: hdLuuThongId}, {
        $set: {
            status: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
            updatedAt: new Date()
        }
    })
        .then(() => {

        });

    luuthong.save(function (error, item) {
        if (error) {
            console.error(error);
        } else {

        }
    });
}

module.exports = {
    newContractAddedListener: newContractAddedListener,
    newContractLuuThongListener: newContractLuuThongListener,
    updateAndNewLuuThong: updateAndNewLuuThong
};