'use strict';

let User = require('app/models/user');
let constants = require('app/config/constants');

class AuthorizationMiddleware {

    /**
     * @constructor
     *
     * @param logger
     * @param adminService
     */
    constructor(logger, userService) {
        this.logger = logger;
        this.userService = userService;
    }

    /**
     * validates a user against the permission required for an endpoint/resource
     *
     * @param permission
     * @param req
     * @param res
     * @param next
     */
    validate(permission, req, res, next) {

        //if there's no permission required, proceed without checking
        if (!permission) {
            next();
            return;
        }

        let userId = req.user.id;
        let userPermissions = [];

        new User({ id: userId }).fetch({ withRelated: ['roles'] })
        .then(user => {
            if (!user) {
                throw new Error('user not found');
            }

            let promises = [];

            user.related('roles').forEach(role => {
                promises.push(
                    role.fetch({ withRelated: ['permissions'] })
                    .then(role => {
                        role.related('permissions').forEach(permission => {
                            if (permission.get('status') === constants.statuses.active) {
                                userPermissions.push(permission.get('action'));
                            }
                        });
                    })
                );
            });

            return Promise.all(promises);
        })
        .then(() => {
            if (userPermissions.indexOf(permission) < 0) {
                throw new Error('action not permitted');
            } else {
                next();
            }
        })
        .catch(() => {
            //permission denied render the forbidden access page here
            res.render('403', { layout: 'error', pageTitle: 'Permission Denied' });
        });
    }
}

module.exports = AuthorizationMiddleware;
