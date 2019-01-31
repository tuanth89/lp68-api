"use strict";

const errors = require('restify-errors');
const AuthorizationService = require('../services/authorizationService');
const FeatureAccessRepo = require('../repository/featureAccessRepo');

const middlewareFeatureAccess = function (req, res, next) {
    // Khi api không thuộc admin thì bỏ qua
    if (!req.route.path.startsWith("/api/admin/")) {
        return next();
    }

    let user = AuthorizationService.getUser(req);

    if (!user) {
        return next(
            new errors.UnauthorizedError("No token provided or token expired!")
        );
    }

    let route = req.route;

    //Nếu route không chứa định nghĩa actions thì sẽ không check và bỏ qua
    if (!route.actions) {
        return next();
    }
    let userRoles = user.userRoles;
    let routeNames = route.actions;

    /**
     * routeNames: danh sách tên các route cần kiểm tra
     * userRoles: danh sách các quyền cần kiểm tra
     * 
     * Hàm sẽ check trong danh sách userRole: có tồn tại role nào có 1 trong các quyền trong routeNames hay không?
     * Nếu thỏa mãn thì trả về resp.flag = true và ngược lại.
     */
    FeatureAccessRepo.checkRoleAccessFreatures(routeNames, userRoles)
        .then(resp => {
            if (resp.flag) {
                next();
            } else {
                return next(
                    new errors.ForbiddenError("Access denied!")
                );
            }
        })
        .catch(err => {
            return next(
                new errors.ForbiddenError("Access denied!")
            );
        })
};

module.exports = middlewareFeatureAccess;