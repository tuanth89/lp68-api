"use strict";

const ReportDailyController = require('../controllers/reportDailyController');
const {
    actions
} = require('../constant/permission');

module.exports = function (server) {
    let prefix = '/api/admin/v1/reportDaily';
    let resource = "reportDaily";

    /**
     * LIST
     */
    server.get({
        path: `${prefix}`,
        actions: [`${resource}.${actions.list}`]
    }, ReportDailyController.listByDate);

    /**
     * GET
     */
    server.get({
        path: `${prefix}/byDate`,
        actions: [`${resource}.${actions.list}`]
    }, ReportDailyController.totalContractDailyByDate);

};
