"use strict";

const ContractLogRepository = require('../../repository/contractLogRepository');
const ContractRepository = require('../../repository/contractRepository');
const HdLuuThongRepository = require('../../repository/hdLuuThongRepository');
const log = require('../../../logger').log;
const CONTRACT_CONST = require('../../constant/contractConstant');
const CONTRACT_OTHER_CONST = require('../../constant/contractOtherConstant');

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
            ContractRepository.updateStatus(data.contractId, data.contractStatus)
                .catch((error) => {
                    log.error(error);
                })
                .done();
        }
    }

    if (data.luuThongId) {
        HdLuuThongRepository.updateStatus(data.luuThongId, data.luuThongStatus)
            .catch((error) => {
                log.error(error);
            })
            .done();
    }
}

module.exports = {
    updateStatusLuuThongContract: updateStatusLuuThongContract
};