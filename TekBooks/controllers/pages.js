'use strict';

module.exports = function (router) {
    router.get('/about', function (req, res) {
        res.render('pages/about');
    });

    router.get('/categories', function (req, res) {
        res.render('pages/categories');
    });
};