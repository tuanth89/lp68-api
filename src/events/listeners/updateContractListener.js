"use strict";

const HdLuuThong = require('../../models/hdLuuThong');
const ContractRepository = require('../../repository/contractRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;

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

        // HdLuuThongRepository.updateStatus(data.luuThongId, data.luuThongStatus)
        //     .catch((error) => {
        //         log.error(error);
        //     })
        //     .done();
    }
}

module.exports = {
    updateStatusLuuThongContract: updateStatusLuuThongContract
};