'use strict';

let permissions = require('app/config/permission_constants');

module.exports = (serviceLocator) => {
    let authorizationMiddleware = serviceLocator.get('authorizationMiddleware');
    let Router = require('app/lib/router');
    let router = new Router(authorizationMiddleware);
    let outboundController = serviceLocator.get('outboundController');

    router.get('/', permissions.VIEW_OUTBOUND,
        (req, res, next) => outboundController.index(req, res, next));
    router.get('/view/:outId', permissions.VIEW_OUTBOUND_DETAILS,
        (req, res, next) => outboundController.view(req, res, next));

    return router.router;
};
