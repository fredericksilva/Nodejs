'use strict';

let permissions = require('app/config/permission_constants');

module.exports = (serviceLocator) => {
    let authorizationMiddleware = serviceLocator.get('authorizationMiddleware');
    let Router = require('app/lib/router');
    let router = new Router(authorizationMiddleware);
    let inboundController = serviceLocator.get('inboundController');

    router.get('/', permissions.VIEW_INBOUND,
        (req, res, next) => inboundController.index(req, res, next));
    router.get('/detail/:id', permissions.VIEW_INBOUND_DETAILS,
        (req, res, next) => inboundController.detail(req, res, next));

    return router.router;
};
