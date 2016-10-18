'use strict';

let constants = require('app/config/constants');

class AdminController {

    /**
     * @constructor
     *
     * @param adminService
     * @param logger
     */
    constructor(passwordService, userService, roleService, warehouseService, permissionService, logger) {
        this.passwordService = passwordService;
        this.userService = userService;
        this.roleService = roleService;
        this.warehouseService = warehouseService;
        this.permissionService = permissionService;
        this.logger = logger;
    }

    /**
     * list users
     *
     * @param req
     * @param res
     */
    users(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'User Administration'
        };

        let params = {};
        if (req.query.page) {
            params.page = req.query.page;
        }

        this.userService.getUsers(params)
        .then(data => {

            viewData.users = data.users;
            viewData.pagination = data.pagination;
            return res.render('users', viewData);

        }).catch(() => {
            req.flash('error', 'There was an error retrieving users. Please try again');
            return res.render('users', viewData);
        });
    }

    /**
     * create new user
     *
     * @param req
     * @param res
     */
    createUsers(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'User Administration'
        };

        this.userService.getNewUserViewData(viewData)
        .then(viewData => {
            return res.render('createuser', viewData);
        })
        .catch(() => {
            req.flash('error', 'An error occurred. Please try again.');

            return res.render('createuser', viewData);
        });
    }

    /**
     * edit user
     *
     * @param req
     * @param res
     */
    editUsers(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'User Administration'
        };

        let userId = req.params.userId;

        if (!userId) {
            req.flash('error', 'No user ID specified');
            return res.redirect('/admin/users');
        }

        this.userService.getUserById(userId)
        .then(user => {
            viewData.user = user;
            viewData.sel_role_id = user.roles[0] ? user.roles[0].id : '';
            viewData.sel_warehouse_id = user.warehouses[0] ? user.warehouses[0].id : '';

            return this.roleService.getRoles();
        }).then(roles => {
            viewData.roles = roles;

            return this.warehouseService.getWareHouses();
        })
        .then(warehouses => {
            viewData.warehouses = warehouses;

            return res.render('edit_user', viewData);
        })
        .catch(err => {
            this.logger.error(err.message);
            req.flash('error', 'An unknown error has occurred please try again later');

            return res.redirect('/admin/users');
        });
    }

    /**
     * Save new user
     *
     * @param req
     * @param res
     * @returns {*}
     */
    saveUsers(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'User Administration'
        };

        let data = req.body;
        let error = this.passwordService.checkPasswordRules(req);
        if (!error) {
            error = this.userService.validateUserData(req);
        } else {
            error.concat(this.userService.validateUserData(req));
        }

        if (error) {
            this.logger.error('Error on validation: ', error);
            viewData.data = data;
            let errMessages = error.map((item) => { return item.msg; });
            req.flash('error', errMessages);

            return this.userService.getNewUserViewData(viewData)
            .then(viewData => {
                return res.render('createuser', viewData);
            });
        }

        this.userService.createUser(data)
        .then(() => {
            req.flash('success', 'User successfully created!');

            return res.redirect('/admin/users');
        })
        .catch((err) => {
            this.logger.error(err.message);
            viewData.data = data;
            req.flash('error', 'An error occurred while trying to update user data. Please try again later.');

            return this.userService.getNewUserViewData(viewData)
            .then(viewData => {
                return res.render('createuser', viewData);
            });
        });
    }

    /**
     * update user
     *
     * @param req
     * @param res
     * @returns {*}
     */
    updateUsers(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'User Administration'
        };

        let data = req.body;
        this.logger.info('User data to be updated => ', data);

        let userId = req.body.id;
        if (!userId) {
            req.flash('error', 'User does not exist!');
            return res.redirect('/admin/users');
        }

        let error = this.userService.validateUserData(req, data.id);

        if (error) {
            viewData.data = data;
            let errMessages = error.map((item) => { return item.msg; });
            req.flash('error', errMessages);

            return this.userService.getNewUserViewData(viewData)
            .then(viewData => {
                return res.render('edit_user', viewData);
            });
        }

        this.userService.updateUser(data)
        .then(() => {
            req.flash('success', 'User successfully updated!');
            return res.redirect('/admin/users');
        })
        .catch(() => {
            viewData.data = data;
            return this.userService.getNewUserViewData(viewData)
            .then(viewData => {
                return res.render('edit_user', viewData);
            });
        });
    }

    /**
     * get roles
     *
     * @param req
     * @param res
     */
    roles(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'Roles Administration'
        };

        this.roleService.getRoles()
        .then((roles)=> {
            viewData.roles = roles;
            return res.render('roles', viewData);
        })
        .catch(()=> {
            req.flash('error', 'Problem with loading existing Roles.');
            return res.render('/admin/roles', viewData);
        });
    }

    /**
     * edit role
     *
     * @param req
     * @param res
     */
    editRole(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'Roles Administration'
        };

        let roleId = req.params.id;

        if (!roleId) {
            req.flash('error', 'Role does not exist!.');
            return res.redirect('/admin/roles');
        }

        this.roleService.getRoleById(roleId)
        .then(role=> {
            viewData.role = role;
            return this.roleService.getRoles();
        })
        .then(roles => {
            viewData.roles = roles;
            return res.render('roles', viewData);
        })
        .catch(()=> {
            req.flash('error', 'Problem with loading Role data.');
            return res.redirect('/admin/roles');
        });
    }

    /**
     * create role
     *
     * @param req
     * @param res
     */
    saveRole(req, res) {
        let data = req.body;
        let roleId = req.params.id;

        if (roleId) {
            data.id = roleId;
        }

        let errors = this.roleService.validateRoleData(req);

        if (errors) {
            req.flash('error', errors);
            return res.redirect('/admin/editRole');
        }

        this.roleService.createRole(data)
        .then(()=> {
            req.flash('success', 'Role successfully saved.');
            return res.redirect('/admin/roles');
        })
        .catch(()=> {
            req.flash('error', 'Problem with saving role');
            return res.redirect('/admin/roles/edit/' + roleId);
        });
    }

    /**
     * Render role with allocated permissions
     * @param req
     * @param res
     */
    rolePermissions(req, res) {
        var viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'Roles Permission Administration'
        };

        let roleId = req.params.id;
        if (!roleId) {
            req.flash('error', 'Role does not exist');
            res.redirect('/admin/roles');
        }

        this.roleService.getRoleById(roleId)
            .then(role => {
                viewData.role = role;
                viewData.permissions = role.permission;
                res.render('rolepermissions', viewData);
            })
            .catch(() => {
                req.flash('error', 'Invalid role specified');
                res.redirect('/admin/roles');
            });

    }

    /**
     * create role permissions
     *
     * @param req
     * @param res
     */
    createRolePermissions(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin users',
            menuActive: 'admin',
            contentHead: 'Roles Permission Administration'
        };

        let roleId = req.params.id;

        if (!roleId) {
            req.flash('error', 'Role does not exist');
            res.redirect('/admin/roles');
        }

        this.roleService.getRoleById(roleId)
        .then(role => {
            viewData.role = role;

            let permId = role.permissions.map((permission) => { return permission.id; });
            return this.permissionService.getAvailablePermissions(permId);
        })
        .then(availablePermission => {
            viewData.availablePermission = availablePermission;
            res.render('createrolepermissions', viewData);
        })
        .catch(() => {
            req.flash('error', 'Problem loading available permissions');
            res.redirect(`/admin/roles/${roleId}/permissions`);
        });
    }

    /**
     * save role permissions
     *
     * @param req
     * @param res
     */
    saveRolePermissions(req, res) {
        let roleId = req.params.id;
        let body = req.body;
        let permissions = body.permissions.split(',');

        if (!roleId) {
            req.flash('error', 'Role does not exist');
            res.redirect('/admin/roles');
        }

        // ensure the role exist and is active
        this.roleService.getRoleById(roleId)
        .then(role => {
            if (role.status !== constants.statuses.active) {
                req.flash('error', 'Permission cannot be added to disabled role');
                res.redirect(`/admin/roles/${roleId}/permissions`);
            } else {
                this.permissionService.saveRolePermissions(permissions, roleId)
                .then(() => {
                    req.flash('success', 'Permission added successfully');
                    res.redirect(`/admin/roles/${roleId}/permissions`);
                })
                .catch(() => {
                    req.flash('error', 'Permission could not be added');
                    res.redirect(`/admin/roles/${roleId}/permissions`);
                });
            }

        });
    }

    /**
     * remove role permissions
     *
     * @param req
     * @param res
     */
    removeRolePermissions(req, res) {
        let roleId = req.params.id;
        let body = req.body;
        let permissions = body.permissions.split(',');

        this.permissionService.revokePermission(permissions, roleId)
        .then(() => {
            req.flash('success', 'Permission revoked successfully.');
            res.redirect(`/admin/roles/${roleId}/permissions`);
        })
        .catch(() => {
            req.flash('error', 'Permission revoke failed.');
            res.redirect(`/admin/roles/${roleId}/permissions`);
        });
    }

    /**
     * permissions page
     *
     * @param req
     * @param res
     */
    permissions(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin Permissions',
            menuActive: 'admin',
            contentHead: 'Permission Administration'
        };

        this.permissionService.getPermissions()
        .then((permissions) => {
            viewData.permissions = permissions;
            res.render('permissions', viewData);
        }).catch(() => {
            req.flash('error', 'something went wrong');
            res.render('permissions', viewData);
        });
    }

    /**
     * edit permissions
     *
     * @param req
     * @param res
     */
    editPermissions(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin Permission',
            menuActive: 'admin',
            contentHead: 'Permission Administration'
        };
        let permissionId = req.params.permissionId;

        if (!permissionId) {
            req.flash('error', 'Permission does not exist');
            res.redirect('/admin/permissions');
        }

        this.permissionService.getPermissionsById(permissionId)
        .then(permission => {
            viewData.permission = permission;
            res.render('createpermission', viewData);
        });
    }

    /**
     * create permissions
     *
     * @param req
     * @param res
     */
    createPermissions(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Admin Permission',
            menuActive: 'admin',
            contentHead: 'Permission Administration'
        };

        res.render('createpermission', viewData);
    }

    /**
     * save permisions
     *
     * @param req
     * @param res
     */
    savePermissions(req, res) {
        let data = req.body;
        let viewData = {
            pageTitle: 'Konga SRN - Admin Permissions',
            menuActive: 'admin',
            contentHead: 'Permission Administration'
        };
        let error = this.permissionService.validatePermissionData(req);

        if (error) {
            req.flash('warning', 'Please fix the highlighted errors');
            viewData.data = data;
            res.render('createpermission', viewData);
        }

        this.permissionService.createPermissions(data)
        .then(() => {
            req.flash('success', 'Permission created successfully');
            res.redirect('/admin/permissions');
        })
        .catch(() => {
            viewData.data = data;
            res.render('createpermission', viewData);
        });
    }

    /**
     * update permission
     *
     * @param req
     * @param res
     */
    updatePermission(req, res) {
        let data = req.body;
        let viewData = {
            pageTitle: 'Konga SRN - Admin Permissions',
            menuActive: 'admin',
            contentHead: 'Permission Administration'
        };
        let permissionId = req.params.permissionId;

        if (!permissionId) {
            req.flash('error', 'Invalid request');
            res.redirect('/admin/permissions');
        }

        let error = this.permissionService.validatePermissionData(req);

        if (error) {
            req.flash('warning', 'Please fix the highlighted errors');
            viewData.data = data;
            res.render('createpermission', viewData);
        }

        this.permissionService.updatePermission(data, permissionId)
        .then(() => {
            req.flash('success', 'Permission updated successfully');
            res.redirect('/admin/permissions');
        })
        .catch(() => {
            viewData.data = data;
            res.render('createpermission', viewData);
        });
    }

    /**
     * update permission status
     *
     * @param req
     * @param res
     */
    updatePermissionStatus(req, res) {
        let permissionId = req.params.permissionId;

        if (!permissionId) {
            req.flash('error', 'Invalid request');
            res.redirect('/admin/permissions');
        }

        this.permissionService.getPermissionsById(permissionId)
        .then(permission => {
            let newStatus = (permission.status === constants.statuses.active) ?
                constants.statuses.inactive : constants.statuses.active;

            this.permissionService.updatePermissionStatus(newStatus, permissionId)
            .then(() => {
                req.flash('success', 'Permission status updated successfully');
                res.redirect('/admin/permissions');
            })
            .catch(() => {
                req.flash('error', 'Permission status update failed');
                res.redirect('/admin/permissions');
            });

        });
    }
}

module.exports = AdminController;
