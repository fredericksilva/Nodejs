'use strict';

let Bookshelf = require('app/bookshelf');
require('app/models/role');

let Permission = Bookshelf.Model.extend({
    tableName: 'permissions',
    hasTimestamps: true,

    roles: function() {
        return this.belongsToMany('Role', 'roles_permissions');
    }
});

module.exports = Bookshelf.model('Permission', Permission);
