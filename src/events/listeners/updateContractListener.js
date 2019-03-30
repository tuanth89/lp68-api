"use strict";

const HdLuuThong = require('../../models/hdLuuThong');
const Contract = require('../../models/contract');
const ContractRepository = require('../../repository/contractRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;
const moment = require('moment');

/**
 * @desc update trạng thái hợp đồng, hợp đồng lưu thông
 * @param {Object} data
 * @returns {*|promise}
 */
function updateStatusLuuThongContract(data) {
    if (data.contractId) {
        if (data.totalMoneyPaid > 0) {
            ContractRepository.updateTotalMoneyPaid(data.contractId, data.totalMoneyPaid)
                .catch((error) => {
                    log.error(error);
                })
                .done();
        }

        if (data.contractStatus > 0) {
            ContractRepository.updateStatusTransferDate(data.contractId, data)
                .catch((error) => {
                    log.error(error);
                })
                .done();
        }
    }

    if (data.luuThongId) {
        let updateSet = {
            status: data.luuThongStatus
        };
        if (data.luuthongMoneyPaid) {
            updateSet.moneyPaid = data.luuthongMoneyPaid;
        }

        HdLuuThong.findOneAndUpdate(
            {
                _id: data.luuThongId
            }, {
                $set: updateSet
            }, function (error, item) {
                if (error) {
                    console.log(error);
                }
            });

        // Trường hợp lãi đứng: chưa nộp hết tiền thì vẫn sinh lưu thông đóng lãi hàng ngày
        if (data.isLaiDung && data.contractStatus === -1) {
            HdLuuThongRepository.insertHdLuuThong(data.contractId, data.dataLuuThong);
        }

    }
}

/**
 * @desc update tổng tiền đã đóng của hợp đồng
 * @param {Object} data
 * @returns {*|promise}
 */
function updateContractTotalMoneyPaid(data) {
    ContractRepository.findById(data.contractId)
        .then(contractItem => {
            let totalMoneyPaid = contractItem.totalMoneyPaid + (data.payMoneyOriginal === undefined ? 0 : data.payMoneyOriginal);
            let updateSet = {
                totalMoneyPaid: totalMoneyPaid
            };
            if (data.newTransferDate) {
                updateSet.transferDate = moment(data.newTransferDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            }

            if (data.appointmentDate) {
                updateSet.appointmentDate = moment(data.appointmentDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            }

            // ContractRepository.updateTotalMoneyPaid(data.contractId, totalMoneyPaid);
            Contract.update({
                _id: data.contractId
            }, {
                $set: updateSet
            }, {upsert: true}, function (error, contract) {
                if (error) {
                    log.error(error);
                }
            });
        })
        .catch((error) => {
            log.error(error);
        })
        .done();
}


module.exports = {
    updateStatusLuuThongContract: updateStatusLuuThongContract,
    updateContractTotalMoneyPaid: updateContractTotalMoneyPaid
};