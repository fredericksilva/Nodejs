'use strict';

let constants = require('app/config/constants');
let Bookshelf = require('app/bookshelf');

require('app/models/role');
require('app/models/warehouse');
let bcrypt = require('bluebird').promisifyAll(require('bcrypt'));

let User = Bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,

    roles: function() {
        return this.belongsToMany('Role', 'users_roles', 'user_id');
    },

    warehouses: function() {
        return this.belongsToMany('Warehouse', 'users_warehouses', 'user_id');
    },

    save: function(user) {
        if (user.password) {
            return this.encryptPassword(user.password)
            .then((hash) => {
                user.password = hash;
                return Bookshelf.Model.prototype.save.apply(this, arguments);
            });
        } else {
            return Bookshelf.Model.prototype.save.apply(this, arguments);
        }
    },

    encryptPassword: function(password) {
        return bcrypt.genSaltAsync(constants.salt_round.DEFAULT)
        .then(function(salt) {
            return bcrypt.hashAsync(password, salt);
        });
    }
});

module.exports = Bookshelf.model('User', User);
