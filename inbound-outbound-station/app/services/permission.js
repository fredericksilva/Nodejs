'use strict';

let Bookshelf = require('app/bookshelf');
let constants = require('app/config/constants');
let Permission = require('app/models/permission');
let RolePermission = require('app/models/roles_permissions');

class PermissionService{

    /**
     * @constructor
     *
     * @param logger
     * @param cache
     */
    constructor(logger, cache) {
        this.logger = logger;
        this.cache = cache;
    }
    /**
     * save role permissions
     *
     * @param permissions
     * @param roleId
     * @returns {Promise.<TResult>}
     */
    saveRolePermissions(permissions, roleId) {
        let data = [];

        permissions.forEach(function(val) {
            let param = {};
            param.role_id = roleId;
            param.permission_id = val;
            data.push(new RolePermission(param));
        });

        return Bookshelf.transaction(trx => {
            let promises = [];
            permissions.forEach(val => {
                let data = {
                    role_id: roleId,
                    permission_id: val
                };

                promises.push(
                    new RolePermission().save(data, { transacting: trx })
                );
            });

            return Promise.all(promises);
        })
        .then(() => {
            this.logger.info(`successfully added permissions to role id: ${roleId}`);
        })
        .catch(err => {
            this.logger.error(`failed to add permissions to role id: ${roleId},
        an error occurred ${err.toString()}`);
            throw new Error('an unknown error occurred, please try again');
        });
    }

    /**
     * revoke permission
     *
     * @param permissions
     * @param roleId
     * @returns {Promise.<TResult>}
     */
    revokePermission(permissions, roleId) {
        return Bookshelf.transaction(trx => {
            let promises = [];

            permissions.forEach(val => {
                promises.push(
                    new RolePermission().query()
                        .where({ role_id: roleId, permission_id: val }).del({ transacting: trx })
                );
            });

            return Promise.all(promises);
        })
        .then(() => {
            this.logger.info(`successfully added permissions to role id: ${roleId}`);
        })
        .catch(err => {
            this.logger.error(`failed to revoke permissions to role id: ${roleId},
        an error occurred ${err.toString()}`);
            throw new Error('an unknown error occurred, please try again');
        });
    }

    /**
     * get permissions
     *
     * @returns {Promise.<TResult>}
     */
    getPermissions() {
        return new Permission().fetchAll().then(permissions => { return permissions.toJSON(); });
    }

    /**
     * get available permissions
     *
     * @param existingPermissions
     * @returns {*|Promise.<TResult>}
     */
    getAvailablePermissions(existingPermissions) {
        return new Permission().query().whereNotIn('id', existingPermissions).andWhere('status', 'active').select()
            .then(permissions => {
                return permissions;
            });
    }

    /**
     * get permissions by ID
     *
     * @param permissionId
     * @returns {Promise.<TResult>}
     */
    getPermissionsById(permissionId) {
        return new Permission({ id: permissionId }).fetch()
            .then(permission => {
                if (!permission) {
                    throw new Error('Permission not found!');
                }

                return permission.toJSON();
            });
    }

    /**
     * validate permission data
     *
     * @param req
     */
    validatePermissionData(req) {
        req.checkBody('name', 'Permission name field is required').notEmpty();
        req.checkBody('action', 'Permission action field is required').notEmpty();

        return req.validationErrors();
    }

    /**
     * create permissions
     *
     * @param req
     * @param res
     * @param data
     * @returns {*|Promise.<TResult>}
     */
    createPermissions(data) {
        let permission = {};
        permission.name = data.name;
        permission.action = data.action;
        permission.status = data.is_active === 'on' ? constants.statuses.active : constants.statuses.inactive;

        return new Permission().save(permission, { method: 'insert' })
            .then(permission => {
                return new Permission({ id: permission.id }).fetch();
            });
    }

    /**
     * update permission
     *
     * @param req
     * @param res
     * @param data
     * @param permissionId
     * @returns {*|Promise.<TResult>}
     */
    updatePermission(data, permissionId) {
        let permission = {};
        permission.name = data.name;
        permission.action = data.action;
        permission.status = data.is_active === 'on' ? constants.statuses.active : constants.statuses.inactive;

        return new Permission({ id: permissionId }).save(permission, { method: 'update' })
            .then(permission => {
                return new Permission({ id: permission.id }).fetch();
            });
    }

    /**
     * update permission status
     *
     * @param newStatus
     * @param permissionId
     * @returns {*}
     */
    updatePermissionStatus(newStatus, permissionId) {
        return new Permission({ id: permissionId }).save({ status: newStatus }, { patch: true });
    }

}

module.exports = PermissionService;
