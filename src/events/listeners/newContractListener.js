"use strict";

const HdLuuThong = require('../../models/hdLuuThong');
const ContractLogRepository = require('../../repository/contractLogRepository');
const ContractRepository = require('../../repository/contractRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');

function createContractLog(contracts) {
    ContractLogRepository.insertMany(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}
function addMultiLogToContractLog(contracts) {
    ContractLogRepository.bulkHistoriesByContractId(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

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
    let luuthongList = [];
    let updateLuuThong = {
        status: CONTRACT_OTHER_CONST.STATUS.COMPLETED,
        updatedAt: new Date()
    };

    let nextPayDate = new Date(contractNew.createdAt);
    nextPayDate.setDate(nextPayDate.getDate() + 1);

    let luuthong = new HdLuuThong();
    luuthong.contractId = contractNew._id;
    luuthong.moneyHavePay = contractNew.dailyMoney;
    luuthong.moneyPaid = contractNew.dailyMoney;
    luuthong.createdAt = nextPayDate;

    luuthongList.push(luuthong);

    if (contractNew.isDaoHd) {
        let luuThongDaoCurrent = new HdLuuThong();
        luuThongDaoCurrent.contractId = contractNew._id;
        luuThongDaoCurrent.createdAt = contractNew.createdAt;
        luuThongDaoCurrent.moneyHavePay = contractNew.dailyMoney;
        luuThongDaoCurrent.moneyPaid = contractNew.dailyMoney;
        luuThongDaoCurrent.status = CONTRACT_OTHER_CONST.STATUS.COMPLETED;
        luuthongList.push(luuThongDaoCurrent);

        // Update tổng tiền đã dóng vào hợp đồng
        ContractRepository.updateTotalMoneyPaid(contractNew._id, luuThongDaoCurrent.moneyPaid);

        // Khi đáo sẽ ko mặc định trừ tiền đóng ngày hôm đó của HĐ cũ
        // HĐ đáo tự động trừ tiền đóng ngày hôm đó
        updateLuuThong.moneyPaid = 0;
    }

    HdLuuThong.update({_id: hdLuuThongId}, {
        $set: updateLuuThong
    })
        .then(() => {

        });

    HdLuuThongRepository.saveMany(luuthongList)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function removeAllByContract(contractId) {
    HdLuuThongRepository.removeByContractId(contractId)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

function insertOrUpdateBulkContractLog(contracts) {
    ContractLogRepository.insertOrUpdateBulkContractLog(contracts)
        .catch((error) => {
            log.error(error);
        })
        .done();
}

module.exports = {
    createContractLog: createContractLog,
    addMultiLogToContractLog: addMultiLogToContractLog,
    newContractAddedListener: newContractAddedListener,
    newContractLuuThongListener: newContractLuuThongListener,
    updateAndNewLuuThong: updateAndNewLuuThong,
    removeAllByContract: removeAllByContract,
    insertOrUpdateBulkContractLog: insertOrUpdateBulkContractLog
};