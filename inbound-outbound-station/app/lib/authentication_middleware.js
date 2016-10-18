'use strict';

let constants = require('app/config/constants');

module.exports = function(req, res, next) {

    let reqPath = req.originalUrl;
    let isAllowUrl = constants.allowedUrls.indexOf(reqPath) > -1;
    if (req.isAuthenticated() || isAllowUrl) {
        res.locals.user = req.user;
        return next();
    }

    req.flash('error', 'You need to sign in to stock station.');
    res.redirect('/login');
};
