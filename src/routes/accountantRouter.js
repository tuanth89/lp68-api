const controller = require('../controllers/accountantController');

const {
    actions
} = require('../constant/permission');

module.exports = (server) => {
    const prefixUrl = '/api/admin/v1/accountant';

    const resource = "accountant";

    /**
     * GET
     */
    server.get({
        path: prefixUrl,
        actions: [`${resource}.${actions.list}`]
    }, controller.getList);

    /**
     * POST
     */
    server.post({
        path: prefixUrl,
        actions: [`${resource}.${actions.create}`]
    }, controller.create);

    /**
     * GET
     */
    server.get({
        path: prefixUrl + '/:id',
        actions: [`${resource}.${actions.list}`]
    }, controller.getById);

    /**
     * UPDATE
     */
    server.put({
        path: prefixUrl + '/:id',
        actions: [`${resource}.${actions.update}`]
    }, controller.update);

    /**
     * Enable or Disable
     */
    server.put({
        path: `${prefixUrl}/:id/setActivate`,
        actions: [`${resource}.${actions.active}`, `${resource}.${actions.lock}`, `${resource}.${actions.unlock}`]
    }, controller.setActivate);

    /**
     * DELETE
     */
    server.del({
        path: prefixUrl + '/:id',
        actions: [`${resource}.${actions.remove}`]
    }, controller.remove);

    // /**
    //  * CHANGE
    //  */
    // server.put(`${prefixUrl}/:id/convert-to-lecturer`, controller.convertToLecturer);
};