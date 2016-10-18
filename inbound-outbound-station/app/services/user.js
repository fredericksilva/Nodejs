'use strict';

let Bookshelf = require('app/bookshelf');
let constants = require('app/config/constants');
let User = require('app/models/user');
let UserRole = require('app/models/users_roles');
let UserWarehouse = require('app/models/users_warehouses');

class UserService{

    /**
     * @constructor
     *
     * @param roleService
     * @param warehouseService
     * @param pagination
     * @param logger
     * @param cache
     */
    constructor(roleService, warehouseService, pagination, logger, cache) {
        this.roleService = roleService;
        this.warehouseService = warehouseService;
        this.pagination = pagination;
        this.logger = logger;
        this.cache = cache;
    }

    /**
     * create new user
     *
     * @param data
     * @returns {*|Promise.<mixed>}
     */
    createUser(data) {
        let user =  {};
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.email = data.email;
        user.status = data.is_active === 'on' ? constants.statuses.active : constants.statuses.inactive;
        user.password = data.password;

        return Bookshelf.transaction(trx => {
            return new User().save(user, { method: 'insert', transacting: trx })
                .tap(user => {
                    let role = [{ role_id: data.role }];
                    return user.roles().attach(role, { method: 'insert', transacting: trx });
                })
                .then(user => {
                    let warehouse = [{ warehouse_id: data.warehouse }];
                    return user.warehouses().attach(warehouse, { method: 'insert', transacting: trx });
                })
                .then(user => {
                    return user;
                });
        });
    }

    /**
     * update user data
     *
     * @param data
     * @returns {*|Promise.<mixed>}
     */
    updateUser(data) {
        var user =  {};
        user.id = data.id;
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.email = data.email;
        user.status = data.is_active === 'on' ? constants.statuses.active : constants.statuses.inactive;

        return Bookshelf.transaction(trx => {
            return new User().save(user, { method: 'update', transacting: trx })
                .tap(user => {
                    return new UserRole().query().where({ user_id: user.id }).del().then(function() {
                        let role = [{ role_id: data.role }];
                        return user.roles().attach(role, { method: 'update', transacting: trx });
                    });
                })
                .then(user => {
                    return new UserWarehouse().query().where({ user_id: user.id }).del().then(function() {
                        let warehouse = [{ warehouse_id: data.warehouse }];
                        return user.warehouses().attach(warehouse, { method: 'insert', transacting: trx });
                    });
                })
                .then(user => {
                    return user;
                });
        });
    }

    /**
     * validate user data
     *
     * @param req
     * @param hasId
     */
    validateUserData(req, hasId) {
        // Form Validator
        req.checkBody('firstname', 'First Name field is required').notEmpty();
        req.checkBody('lastname', 'Last Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email Entry is not valid').isEmail(); // also a valid email

        if (!hasId) {
            req.checkBody('password', 'Password field is required').notEmpty();
            req.checkBody('retype_password', 'Confirm password field is required').notEmpty();
            req.checkBody('retype_password', 'Passwords does not match').equals(req.body.password);
        }

        // Check Errors
        return req.validationErrors();
    }

    /**
     * get users
     *
     * @returns {Promise.<TResult>}
     */
    getUsers(params) {

        let pagination = {};
        let pages = this.pagination.getPagination(params);

        return User.count('id')
            .then(count => {
                pages.total = count;

                return User.query(qb => {
                    qb.limit(pages.limit).offset(pages.offset);
                }).fetchAll({ withRelated: ['roles', 'warehouses'] });
            })
            .then(users => {

                pagination = this.pagination.paginate({
                    limit: pages.limit,
                    offset: pages.offset,
                    total: pages.total
                });
                return {
                    users: users.toJSON(),
                    pagination: pagination
                };

            });
    }

    /**
     * get user by ID
     *
     * @param userId
     * @returns {Promise.<TResult>}
     */
    getUserById(userId) {
        return new User({ id: userId }).fetch({ withRelated: ['roles', 'warehouses'] })
            .then(user => {
                if (!user) {
                    throw new Error('User not found!');
                }

                return user.toJSON();
            });
    }

    /**
     * get user by email
     *
     * @param email
     * @returns {Promise.<TResult>}
     */
    getUserByEmail(email) {
        return new User({ email }).fetch().then(user => {
            return user;
        })
            .catch(err => {
                this.logger.error(`an error occurred fetching user record`);

                throw err;
            });
    }

    /**
     * New User View Data
     *
     * @param data
     * @returns {Promise.<TResult>}
     */
    getNewUserViewData(data) {
        return this.roleService.getRoles()
            .then(roles => {
                data.roles = roles;
                return this.warehouseService.getWareHouses();
            })
            .then(warehouses => {
                data.warehouses = warehouses;
                return data;
            });
    }

    /**
     * Check if user is Super Admin
     *
     * @param user
     * @return {boolean}
     */
    isSuperAdmin(user) {
        if (user.roles && user.roles.length > 0) {
            return user.roles[0].id === constants.roles.basic.superAdmin.id;
        }

        return false;
    }

    /**
     * Get warehouse a user belong to
     *
     * @param user
     * @return {*}
     */
    getWarehouse(user) {
        if (user.warehouses && user.warehouses.length > 0) {
            return user.warehouses[0].name.toLowerCase();
        }

        return null;
    }

}

module.exports = UserService;
