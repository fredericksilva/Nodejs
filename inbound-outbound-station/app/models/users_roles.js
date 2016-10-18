'use strict';

let Bookshelf = require('app/bookshelf');
require('app/models/role');
require('app/models/user');

let UserRole = Bookshelf.Model.extend({
    tableName: 'users_roles',
    hasTimestamps: false,

    roles: function() {
        return this.belongsTo('Role', 'roles');
    },

    users: function() {
        return this.belongsTo('User', 'users');
    }
});

module.exports = Bookshelf.model('UserRole', UserRole);
