'use strict';

let permissions = require('app/config/permission_constants');

module.exports = (serviceLocator) => {
    let authorizationMiddleware = serviceLocator.get('authorizationMiddleware');
    let Router = require('app/lib/router');
    let router = new Router(authorizationMiddleware);
    let adminController = serviceLocator.get('adminController');

    router.get('/users', permissions.VIEW_USERS, (req, res, next) => adminController.users(req, res, next));
    router.get('/users/edit/:userId', permissions.VIEW_USER_DETAILS,
        (req, res, next) => adminController.editUsers(req, res, next));
    router.get('/users/create', permissions.CREATE_USER,
        (req, res, next) => adminController.createUsers(req, res, next));
    router.post('/users', permissions.SAVE_USER, (req, res, next) => adminController.saveUsers(req, res, next));
    router.post('/users/update', permissions.UPDATE_USER,
        (req, res, next) => adminController.updateUsers(req, res, next));
    router.get('/roles', permissions.VIEW_ROLES, (req, res, next) => adminController.roles(req, res, next));
    router.get('/roles/edit/:id', permissions.EDIT_ROLE, (req, res, next) => adminController.editRole(req, res, next));
    router.post('/roles', permissions.SAVE_ROLE, (req, res, next) => adminController.saveRole(req, res, next));
    router.post('/roles/:id', permissions.UPDATE_ROLE, (req, res, next) => adminController.saveRole(req, res, next));
    router.get('/roles/:id/permissions', permissions.VIEW_ROLE_PERMISSIONS,
        (req, res, next) => adminController.rolePermissions(req, res, next));
    router.get('/roles/:id/addpermissions', permissions.CREATE_ROLE_PERMISSIONS,
        (req, res, next) => adminController.createRolePermissions(req, res, next));
    router.post('/roles/:id/addpermissions', permissions.SAVE_ROLE_PERMISSIONS,
        (req, res, next) => adminController.saveRolePermissions(req, res, next));
    router.post('/roles/:id/removepermissions', permissions.REMOVE_ROLE_PERMISSIONS,
        (req, res, next) => adminController.removeRolePermissions(req, res, next));
    router.get('/permissions', permissions.VIEW_PERMISSIONS,
        (req, res, next) => adminController.permissions(req, res, next));
    router.get('/permissions/edit/:permissionId', permissions.EDIT_PERMISSIONS,
        (req, res, next) => adminController.editPermissions(req, res, next));
    router.get('/permissions/create', permissions.CREATE_PERMISSION,
        (req, res, next) => adminController.createPermissions(req, res, next));
    router.post('/permissions', permissions.SAVE_PERMISSION,
        (req, res, next) => adminController.savePermissions(req, res, next));
    router.post('/permissions/:permissionId', permissions.UPDATE_PERMISSION,
        (req, res, next) => adminController.updatePermission(req, res, next));
    router.get('/permissions/status/:permissionId', permissions.UPDATE_PERMISSION_STATUS,
        (req, res, next) => adminController.updatePermissionStatus(req, res, next));

    return router.router;
};
