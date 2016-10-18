'use strict';

exports.up = function(knex) {
    return knex.schema
    .createTableIfNotExists('password_reset_link', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('users.id');
        table.string('email');
        table.string('code');
        table.string('link').notNullable();
        table.datetime('expiry').notNullable();
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('password_reset_link');
};
