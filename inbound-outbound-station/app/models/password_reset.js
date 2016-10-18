'use strict';

require('app/models/user');
let Bookshelf = require('app/bookshelf');

let PasswordReset = Bookshelf.Model.extend({
    tableName: 'password_reset_link',
    hasTimestamps: true
});

module.exports = Bookshelf.model('PasswordReset', PasswordReset);
