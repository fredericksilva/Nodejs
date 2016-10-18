'use strict';

let config = require('app/config/config');
let knex = require('knex')({
    client: 'mysql',
    connection: config.mysql.connection,
    pool: config.mysql.pool
});

module.exports = knex;
