'use strict';

const config = require('./app/config/config');

let dbConfig = {
    client: 'mysql',
    connection: config.mysql.connection,
    pool: config.mysql.pool,
    migrations: {
        tableName: 'migrations'
    }
};

/**
 * Database settings.
 *
 * Setting the db settings in knexfile allows us to make use of the migrations & ORM.
 *
 * @type {Object} Database settings
 */
module.exports = {
    production: dbConfig,
    staging: dbConfig,
    development: dbConfig
};
