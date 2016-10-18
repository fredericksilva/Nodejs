'use strict';

let passport = require('passport');

module.exports = (serviceLocator) => {
    let authorizationMiddleware = serviceLocator.get('authorizationMiddleware');
    let Router = require('app/lib/router');
    let router = new Router(authorizationMiddleware);
    let homeController = serviceLocator.get('homeController');

    router.get('/', null, (req, res, next) => homeController.index(req, res, next));
    router.get('/login', null, (req, res, next) => homeController.login(req, res, next));
    router.post('/login', null,
        [passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        (req, res) => homeController.authenticated(req, res)]
    );
    router.get('/account/resetpassword', null, (req, res, next) => homeController.resetPassword(req, res, next));
    router.post('/account/resetpassword', null, (req, res, next) => homeController.sendPasswordReset(req, res, next));
    router.post('/account/updatepassword', null, (req, res, next) => homeController.updateUserPassword(req, res, next));
    router.get('/logout', null, (req, res, next) => homeController.logout(req, res, next));

    return router.router;
};
