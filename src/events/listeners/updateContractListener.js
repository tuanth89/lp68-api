"use strict";

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