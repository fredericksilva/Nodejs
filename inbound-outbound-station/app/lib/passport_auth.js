'use strict';

let constants = require('app/config/constants');

class PassportAuthentication {

    /**
     * @constructor
     *
     * @param userService
     * @param passwordService
     * @param logger
     */
    constructor(userService, passwordService, logger) {
        this.userService = userService;
        this.passwordService = passwordService;
        this.logger = logger;
    }

    /**
     * Serialize user details
     *
     * @param user
     * @param done
     */
    serializeUser(user, done) {
        done(null, user.get('id'));
    }

    /**
     * Deserialize user data from user id
     *
     * @param id
     * @param done
     */
    deserializeUser(id, done) {
        this.userService.getUserById(id)
        .then(user => {
            delete user.password;
            done(null, user);
        });
    }

    /**
     * Strategy (Local) to use for authentication
     *
     * @param email
     * @param password
     * @param done
     * @return {Promise.<TResult>}
     */
    localStrategy(email, password, done) {
        this.logger.info(`Local Strategy for User with email: ${email}`);
        let _user = {};
        this.userService.getUserByEmail(email)
        .then(user => {
            _user = user;
            if (!user) {
                return done(null, false, { message: 'Invalid email. Please check you email and try again.' });
            }

            if (user.get('status') !== constants.statuses.active) {
                return done(null, false, { message: 'User account not active. Please contact the administrator.' });
            }

            let hash = user.get('password');
            return this.passwordService.comparePasswords(password, hash);
        })
        .then(isMatch => {

            if (isMatch) {
                return done(null, _user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    }
}

module.exports = PassportAuthentication;
