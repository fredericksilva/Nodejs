'use strict';

let constants = require('app/config/constants');

exports.up = function(knex) {
    return knex.schema
    .createTableIfNotExists('users', function(table) {
        table.increments('id').primary();
        table.string('firstname').notNullable();
        table.string('lastname');
        table.string('email').unique().comment('Email will serve as username.');
        table.string('password');
        table.enu('status', constants.users.STATUSES);
        table.timestamps();
    })
    .createTableIfNotExists('roles', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('description');
        table.enu('status', constants.roles.STATUSES);
        table.timestamps();
    })
    .createTableIfNotExists('warehouses', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.enu('status', constants.roles.STATUSES);
        table.timestamps();
    })
    .createTableIfNotExists('permissions', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.string('action');
        table.enu('status', constants.roles.STATUSES);
        table.timestamps();
    })
    .createTableIfNotExists('users_warehouses', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('warehouse_id').unsigned().references('id').inTable('warehouses').onDelete('CASCADE');
        table.unique(['user_id', 'warehouse_id']);
    })
    .createTableIfNotExists('users_roles', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
        table.unique(['user_id', 'role_id']);
    })

    .createTableIfNotExists('roles_permissions', function(table) {
        table.increments('id').primary();
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
        table.integer('permission_id').unsigned().references('id').inTable('permissions').onDelete('CASCADE');
        table.unique(['role_id', 'permission_id']);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('roles_permissions')
    .dropTableIfExists('users_roles')
    .dropTableIfExists('users_warehouses')
    .dropTableIfExists('users')
    .dropTableIfExists('roles')
    .dropTableIfExists('warehouses')
    .dropTableIfExists('permissions');
};
