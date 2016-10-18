'use strict';

let Bookshelf = require('app/bookshelf');
require('app/models/user');
require('app/models/permission');

let Role = Bookshelf.Model.extend({
    tableName: 'roles',
    hasTimestamps: true,

    users: function() {
        return this.belongsToMany('User', 'users_roles', 'role_id');
    },

    permissions: function() {
        return this.belongsToMany('Permission', 'roles_permissions', 'role_id');
    }
});

module.exports = Bookshelf.model('Role', Role);
