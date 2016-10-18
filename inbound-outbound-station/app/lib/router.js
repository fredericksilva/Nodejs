'use strict';

class Router {

    /**
     * @constructor
     *
     * Custom wrapper for the express router to allow custom variables
     * @param authorizationMiddleware
     */
    constructor(authorizationMiddleware) {
        this.authorizationMiddleware = authorizationMiddleware;
        this.router = require('express').Router();
    }

    /**
     * apply the authorization middleware to the route
     *
     * @param url
     * @param permission
     */
    validate(url, permission) {
        this.router.use(url, (req, res, next) => this.authorizationMiddleware.validate(permission, req, res, next));
    }

    /**
     * get wrapper
     *
     * @param url
     * @param permission
     * @param args
     */
    get(url, permission, args) {
        this.validate(url, permission);
        this.router.get.apply(this.router, [url].concat(args));
    }

    /**
     * post wrapper
     *
     * @param url
     * @param permission
     * @param args
     */
    post(url, permission, args) {
        this.validate(url, permission);
        this.router.post.apply(this.router, [url].concat(args));
    }

    /**
     * put wrapper
     *
     * @param url
     * @param permission
     * @param args
     */
    put(url, permission, args) {
        this.validate(url, permission);
        this.router.put.apply(this.router, [url].concat(args));
    }

    /**
     * del wrapper
     *
     * @param url
     * @param permission
     * @param args
     */
    del(url, permission, args) {
        this.validate(url, permission);
        this.router.delete.apply(this.router, [url].concat(args));
    }
}

module.exports = Router;
