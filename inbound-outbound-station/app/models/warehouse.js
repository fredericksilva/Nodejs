'use strict';

let Bookshelf = require('app/bookshelf');
require('app/models/user');

let Warehouse = Bookshelf.Model.extend({
    tableName: 'warehouses',
    hasTimestamps: true,

    users: function() {
        return this.belongsToMany('User', 'users_warehouses', 'warehouse_id');
    }
});

module.exports = Bookshelf.model('Warehouse', Warehouse);
