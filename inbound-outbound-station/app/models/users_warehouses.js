'use strict';

let Bookshelf = require('app/bookshelf');
require('app/models/warehouse');
require('app/models/user');

let UserWarehouse = Bookshelf.Model.extend({
    tableName: 'users_warehouses',
    hasTimestamps: false,

    roles: function() {
        return this.belongsTo('Warehouse', 'warehouses');
    },

    users: function() {
        return this.belongsTo('User', 'users');
    }
});

module.exports = Bookshelf.model('UserPermission', UserWarehouse);
