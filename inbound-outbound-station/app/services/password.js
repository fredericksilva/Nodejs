'use strict';

let config = require('app/config/config');
let constants = require('app/config/constants');
let PasswordReset = require('app/models/password_reset');
let Users = require('app/models/user');
let uuid = require('uuid');
let bcrypt = require('bcrypt');

class PasswordService {

    /**
     * @constructor
     *
     * @param userService
     * @param logger
     * @param notification
     */
    constructor(userService, logger, notification) {
        this.userService = userService;
        this.logger = logger;
        this.notification = notification;
    }

    /**
     * send email for password reset link
     *
     * @param email
     * @param isNew
 * @returns {*}
     */
    sendPasswordResetEmail(email, isNew) {
        return this.userService.getUserByEmail(email)
        .then(user => {
            if (!user) {
                this.logger.error(`User not found`);
                throw new Error('user not found');
            }

            if (user.get('status') !== constants.statuses.active) {
                this.logger.error(`User status is inactive. Can't send password reset email`);
                throw new Error(`Account is inactive`);
            }

            return PasswordService.generatePasswordResestLink(user)
            .then(reset => {
                let subject = 'Email reset link';
                let template = isNew ? config.services.hermes.templates.new_user_password_reset :
                                    config.services.hermes.templates.password_reset;
                let params = {
                    name: user.get('firstname') + ' ' + user.get('lastname'),
                    link: reset.get('link')
                };

                return this.notification.sendEmail(email, subject, template, params);
            });
        });
    }

    /**
     * validate password reset link
     *
     * @param userId
     * @param code
     * @returns {Promise.<T>}
     */
    validatePasswordResetLink(userId, code) {
        return PasswordReset.where({ user_id: userId, code: code }).fetch()
        .then(resetLinkData => {
            if (resetLinkData) {
                let exp = new Date(resetLinkData.get('expiry')).getTime();
                let now = new Date().getTime();

                return (exp > now);
            }

            return false;
        });
    }

    /**
     * expire password reset link
     *
     * @param userId
     * @param code
     * @returns {Promise.<T>}
     */
    expirePasswordResetLink(userId, code) {
        return PasswordReset.where({ user_id: userId, code: code }).fetch()
        .then(resetLinkData => {
            if (resetLinkData) {
                let time = new Date().getTime();
                let exp = new Date(time - 1000);

                return resetLinkData.save({ expiry: exp }, { patch: true });
            } else {
                throw new Error('link not found');
            }
        });
    }

    /**
     * validate password update data
     *
     * @param req
     * @returns {Promise.<T>}
     */
    validatePasswordUpdate(req) {
        return this.validatePasswordResetLink(req.body.id, req.body.code)
        .then(valid => {
            if (valid) {
                req.checkBody('password', 'Passwords do not match').equals(req.body.confirm_password);

                return this.checkPasswordRules(req);
            } else {
                throw new Error('invalid or expired link');
            }
        });
    }

    /**
     * Encrypt password
     *
     * @param password
     * @return {Promise}
     */
    encryptPassword(password) {

        return new Promise((resolve, reject) => {
            bcrypt.genSalt(constants.salt_round.DEFAULT, function(err, salt) {
                if (err) {
                    reject(err);
                }

                bcrypt.hash(password, salt, function(err, hash) {

                    if (err) {
                        reject(err);
                    }

                    resolve(hash);
                });
            });
        });
    }

    /**
     * Compare a password with an hash
     *
     * @param password
     * @param hash
     * @return {Promise}
     */
    comparePasswords(password, hash) {
        return new Promise((resolve, reject) => {

            bcrypt.compare(password, hash, (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    }

    /**
     * update user password
     *
     * @param req
     * @returns {Promise.<T>}
     */
    updateUserPassword(req) {
        let userId = req.body.id;
        let newPassword = req.body.password;
        let code = req.body.code;

        return this.validatePasswordUpdate(req)
        .then(error => {
            if (error) {
                throw new Error(error[0].msg);
            } else {
                return new Users({ id: userId }).fetch({ require: true })
                .then(user => {
                    return user.save({ password: newPassword }, { patch: true })
                    .then(() => {
                        return this.expirePasswordResetLink(userId, code);
                    });
                });
            }
        })
        .catch(err => {
            throw new Error(err.message);
        });
    }

    /**
     * generate password reset link for user
     *
     * @param user
     * @returns {*}
     */
    static generatePasswordResestLink(user) {
        let url = config.web.app_url;
        let code = uuid.v1();
        let link = url + 'account/resetpassword?u=' + user.id + '&code=' + code;
        let time = new Date().getTime();
        let expiry = new Date(time + (parseInt(config.email_token_expiry) * 1000));

        let data = {
            user_id: user.id,
            email: user.get('email'),
            link: link,
            expiry: expiry,
            code: code
        };

        return new PasswordReset().save(data, { method: 'insert' });
    }

    /**
     * check password rules
     *
     * @param req
     */
    checkPasswordRules(req) {
        req.checkBody('password', 'Password must contain at least 8 chars')
            .matches(/^[0-9a-zA-Z!@#\$%\^&\*\)\(\+=\._\-]{8,}$/, 'i');

        req.checkBody('password', 'Password must contain at least 1 uppercase character')
            .matches(/^(?=.*[A-Z])[0-9a-zA-Z!@#\$%\^&\*\)\(\+=\._\-]{8,}$/, 'i');

        req.checkBody('password', 'Password must contain at least 1 lowercase character')
            .matches(/^(?=.*[a-z])[0-9a-zA-Z!@#\$%\^&\*\)\(\+=\._\-]{8,}$/, 'i');

        req.checkBody('password', 'Password must contain at least 1 special character')
            .matches(/^(?=.*[!@#\$%\^&\*\)\(\+=\._\-])[0-9a-zA-Z!@#\$%\^&\*\)\(\+=\._\-]{8,}$/, 'i');

        req.checkBody('password', 'Password must contain at least 1 numeric character')
            .matches(/^(?=.*\d)[0-9a-zA-Z!@#\$%\^&\*\)\(\+=\._\-]{8,}$/, 'i');

        return req.validationErrors();
    }
}

module.exports = PasswordService;
