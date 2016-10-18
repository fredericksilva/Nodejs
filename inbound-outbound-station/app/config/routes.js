'use strict';

module.exports = (app, serviceLocator) => {

    let inbound = require('app/routes/inbound')(serviceLocator);
    let outbound = require('app/routes/outbound')(serviceLocator);
    let home = require('app/routes/home')(serviceLocator);
    let admin = require('app/routes/admin')(serviceLocator);

    //Define custom routes
    app.use('/', home);
    app.use('/inbound', inbound);
    app.use('/outbound', outbound);
    app.use('/admin', admin);
    app.use('/account', home);

};
