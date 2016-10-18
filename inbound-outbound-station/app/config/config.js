'use strict';

let appName = 'IOStation';
const config = {
    environment: process.env.NODE_ENV || 'development',
    dev_mode: process.env.DEV_MODE || 1,
    email_token_expiry: process.env.EMAIL_TOKEN_EXPIRY_PERIOD,
    pagination: {
        default_limit: 10,
        default_offset: 0,
        max_limit: 50
    },
    request_retry: {
        max_attempts: 3,
        retry_delay: 100
    },
    web: {
        port: process.env.PORT,
        app_url: process.env.APP_URL,
        inbound_service_base_url: process.env.INBOUND_SERVICE_BASE_URL,
        stock_request_service_url: process.env.STOCK_REQUEST_SERVICE_URL,
        catalog_service_url: process.env.CATALOG_SERVICE_URL,
        catalog_service_timeout: parseInt(process.env.CATALOG_TIMEOUT),
        image_service_url: process.env.IMAGE_SERVICE_URL
    },
    cookie: {
        // secure: process.env.COOKIE_SECURE || true,
        maxAge: (process.env.MAX_AGE) ? parseInt(process.env.MAX_AGE) : 1800000,
        domain: process.env.COOKIE_DOMAIN
    },
    session: {
        secret: process.env.SESSION_SECRET
    },
    redis: {
        host: process.env.REDIS_PORT_6379_TCP_ADDR || process.env.REDIS_HOST,
        port: process.env.REDIS_PORT_6379_TCP_PORT || process.env.REDIS_PORT || 6379,
        database: process.env.REDIS_DATABASE || 0
    },
    mysql: {
        connection: {
            host: process.env.MYSQL_PORT_3306_TCP_ADDR || process.env.DATABASE_HOST,
            port: process.env.MYSQL_PORT_3306_TCP_PORT || process.env.DATABASE_PORT,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            debug: process.env.DATABASE_DEBUG ? ['ComQueryPacket'] : false
        },
        pool: {
            min: (process.env.DATABASE_POOL_MIN) ? parseInt(process.env.DATABASE_POOL_MIN) : 2,
            max: (process.env.DATABASE_POOL_MAX) ? parseInt(process.env.DATABASE_POOL_MAX) : 2
        }
    },
    logging: {
        file: process.env.LOG_PATH || '/tmp/srs.log',
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true
    },
    oauth: {
        url: process.env.OAUTH_URL,
        client_id: process.env.OAUTH_CLIENT_ID || '',
        client_secret: process.env.OAUTH_CLIENT_SECRET || '',
        cache_key: appName,
        timeout: parseInt(process.env.REQUEST_TIMEOUT),
        scopes: {
            hermes: 'private/hermes/send-notification'
        }
    },
    services: {
        hermes: {
            notification_sender: process.env.NOTIFICATION_SENDER || 'noreply@konga.com',
            notification_sender_id: process.env.NOTIFICATION_SENDER_ID || appName,
            url: process.env.HERMES_URL,
            templates: {
                password_reset: 'iostation_password_reset',
                new_user_password_reset: 'iostation_new_user_password_reset'
            },
            timeout: process.env.HERMES_TIMEOUT || 3000
        }
    }
};

module.exports = config;
