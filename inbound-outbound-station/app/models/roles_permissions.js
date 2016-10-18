'use strict';

require('app/models/permission');
require('app/models/role');

let Bookshelf = require('app/bookshelf');

let RolePermission = Bookshelf.Model.extend({
    tableName: 'roles_permissions',
    hasTimestamps: false,

    roles: function() {
        return this.belongsTo('Role', 'roles');
    },

    permissions: function() {
        return this.belongsTo('Permission', 'permissions');
    }
});

module.exports = Bookshelf.model('RolePermission', RolePermission);
