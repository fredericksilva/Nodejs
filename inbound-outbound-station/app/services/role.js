'use strict';

let constants = require('app/config/constants');
let Role = require('app/models/role');

class RoleService{

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
     * get roles
     *
     * @returns {Promise.<TResult>}
     */
    getRoles() {
        return new Role().fetchAll().then(roles => { return roles.toJSON(); });
    }

    /**
     * get role by ID
     *
     * @param roleId
     * @returns {Promise.<TResult>}
     */
    getRoleById(roleId) {
        return new Role({ id: roleId }).fetch({ withRelated: ['permissions'] }).then(role => {
            if (!role) {
                throw new Error('Role not found!');
            }

            return role.toJSON();
        });
    }

    /**
     * validate role data
     *
     * @param req
     */
    validateRoleData(req) {
        // Form Validator
        req.checkBody('name', 'Role Name field is required').notEmpty();

        // Check Errors
        return req.validationErrors();
    }

    /**
     * create role
     *
     * @param data
     * @returns {*|Promise.<TResult>}
     */
    createRole(data) {
        let role = {};
        role.name = data.name && data.name.trim();
        role.status = data.is_active === 'on' ? constants.statuses.active : constants.statuses.inactive;

        //set id when on edit mode
        if (data.id) {
            role.id = data.id;
        }

        return new Role(role).save()
            .then((role) => {
                return role;
            });

    }
}

module.exports = RoleService;
