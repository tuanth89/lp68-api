"use strict";

const FeatureAccessController = require('../controllers/featureAccessController');
const {
    actions
} = require('../constant/permission');

const prefixUrl = '/api/admin/v1/feature-access';
const resource = "featureAccess";

module.exports = function (server) {

    /**
     * Thêm mới feature
     */

    server.post({
        path: prefixUrl,
    }, FeatureAccessController.create);


    /**
     * Thêm mới nhiều feature
     */
    server.put({
        path: prefixUrl,
    }, FeatureAccessController.addOrUpdate);

    /**
     * Set quyền truy cập cho role vào 1 action
     */
    server.put({
        path: prefixUrl + '/:friendlyName/update-role',
        actions: [`role.${actions.update}`]
    }, FeatureAccessController.updateAction);

    server.put({
        path: prefixUrl + '/:friendlyName',
    }, FeatureAccessController.update);

    /**
     * Lấy về danh sách FeatureAccess
     */
    server.get({
        path: prefixUrl,
    }, FeatureAccessController.list);
    /**
     * Lấy về danh sách quyền có được xuất bản khóa học không.
     */
    server.get({
        path: prefixUrl + '/rolePublish',
    }, FeatureAccessController.checkRolePublish);


    /**
     * Lấy về danh sách features theo người dùng đăng nhập hiện tại
     */
    server.get({
        path: prefixUrl + '/getByCurrentUser',
    }, FeatureAccessController.getFeaturesByCurrentUser);

    /**
     * Lấy về danh sách features theo roleName
     */
    server.get({
        path: prefixUrl + '/getByRole/:roleName'
    }, FeatureAccessController.getFeaturesByRole);

    /**
     * Xóa bỏ role khỏi feature
     */
    server.del({
        path: prefixUrl + '/:friendlyName/remove-role',
        actions: [`role.${actions.update}`]
    }, FeatureAccessController.removeRoleAction);

    /**
     * Xóa feature
     */
    server.del({
        path: prefixUrl + '/:friendlyName',
    }, FeatureAccessController.remove);


    server.post(prefixUrl + "/getUsersByNotificationType", FeatureAccessController.getUsersByNotificationType);
};