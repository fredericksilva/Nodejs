'use strict';

class HomeController {

    /**
     * @constructor
     *
     * @param passwordService
     * @param logging
     */
    constructor(passwordService, logging) {
        this.passwordService = passwordService;
        this.logging = logging;
    }

    /**
     * homepage
     *
     * @param req
     * @param res
     * @returns {*}
     */
    index(req, res) {
        return res.render('home', { title: 'Welcome to IOStation' });
    }

    /**
     * login page
     *
     * @param req
     * @param res
     * @returns {*}
     */
    login(req, res) {
        res.render('login', { title: 'Login to IOStation', layout: 'account' });
    }

    /**
     * After successful user authentication
     *
     * @param req
     * @param res
     * @returns {*}
     */
    authenticated(req, res) {
        req.flash('success', 'You are now successfully logged in! Welcome to Stock Station');
        res.redirect('/');
    }

    /**
     * logout action
     *
     * @param req
     * @param res
     * @returns {*}
     */
    logout(req, res) {
        req.logout();
        req.flash('success', 'You have successfully logged out');
        return res.redirect('/login');
    }

    /**
     * reset password page
     *
     * @param req
     * @param res
     * @returns {*}
     */
    resetPassword(req, res) {
        let viewData = {
            pageTitle: 'Reset your password - IOStation',
            menuActive: 'admin',
            contentHead: 'Send password reset link',
            layout: 'account'
        };

        let userId = req.query.u;
        let code = req.query.code;

        if (userId && code) {
            this.passwordService.validatePasswordResetLink(userId, code)
            .then(valid => {
                if (valid) {
                    viewData.user_id = userId;
                    viewData.code = code;
                    viewData.contentHead = 'Update your password';

                    return res.render('updatepassword', viewData);
                } else {
                    req.flash('error', 'invalid or expired link, please request a new reset link');
                    return res.redirect('/account/resetpassword');
                }
            });
        } else {
            return res.render('resetpassword', viewData);
        }
    }

    /**
     * send password reset link
     *
     * @param req
     * @param res
     */
    sendPasswordReset(req, res) {
        this.passwordService.sendPasswordResetEmail(req.body.email)
        .then(() => {
            req.flash('success', 'You\'ll receive an email reset link if you have an account with us');
            return res.redirect('/account/login');
        })
        .catch(() => {
            req.flash('error', 'Something went wrong, please try again later');
            return res.redirect('/account/resetpassword');
        });
    }

    /**
     * update user password
     *
     * @param req
     * @param res
     */
    updateUserPassword(req, res) {
        let code = req.body.code;
        let userId = req.body.id;

        this.passwordService.updateUserPassword(req)
        .then(() => res.redirect('/account/login'))
        .catch(() => {
            let uri = '/account/resetpassword?u=' + userId + '&code=' + code;
            req.flash('error', 'Something went wrong, please try again later');

            return res.redirect(uri);
        });
    }
}

module.exports = HomeController;
