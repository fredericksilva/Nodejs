'use strict';

module.exports = {

    create: () => {
        let config = require('app/config/config');
        let serviceLocator = require('konga-service-locator');

        let Cache = require('konga-redis');
        let RequestClient = require('app/lib/api_client');
        let Hermes = require('konga-hermes');
        let OAuth2 = require('konga-oauth2');
        let tokenProvider = require('konga-accesstoken-provider');
        let Catalog = require('konga-catalog');
        let CatalogClient = require('app/lib/catalog_client');
        let Pagination = require('app/lib/pagination');

        let AdminController = require('app/controllers/admin_controller');
        let UserService = require('app/services/user');
        let RoleService = require('app/services/role');
        let WarehouseService = require('app/services/warehouse');
        let PermissionService = require('app/services/permission');
        let PasswordService = require('app/services/password');
        let HomeController = require('app/controllers/home_controller');
        let InboundController = require('app/controllers/inbound_controller');
        let InboundService = require('app/services/inbound');
        let InboundModel = require('app/models/inbound');
        let OutboundController = require('app/controllers/outbound_controller');
        let OutboundService = require('app/services/outbound');
        let OutboundModel = require('app/models/outbound');
        let NotificationLib = require('app/lib/notifications');
        let StockServiceClient = require('app/lib/stock_service_client');
        let PassportAuthentication = require('app/lib/passport_auth');
        let AuthorizationLib = require('app/lib/authorization_middleware');

        /**
         * Returns an instance of Konga logger
         */
        serviceLocator.register('logger', () => {
            return require('konga-logging').create(config.logging);
        });

        serviceLocator.register('oauth', (serviceLocator) => {
            let cache = serviceLocator.get('cache');

            return new OAuth2(
                config.oauth.url,
                config.oauth.client_id,
                config.oauth.client_secret,
                cache,
                {
                    cache_key: config.oauth.cache_key
                }
            );
        });

        /**
         * Returns an instance of the redis cache.
         */
        serviceLocator.register('cache', () => {
            let cache = new Cache(config.redis.port, config.redis.host);
            cache.select(config.redis.database);

            return cache;
        });

        /**
         * Returns a knex instance.
         */
        serviceLocator.register('knex', () => {
            return require('knex')({
                client: 'mysql',
                connection: config.mysql.connection,
                pool: config.mysql.pool
            });
        });

        /**
         * Creates an instance of the Paginator Library
         */
        serviceLocator.register('Paginator', (serviceLocator) => {

            let logger = serviceLocator.get('logger');

            return new Pagination(logger, config);
        });

        /**
         * Creates an instance of the password service
         */
        serviceLocator.register('passwordService', (serviceLocator) => {
            let logger = serviceLocator.get('logger');
            let notification = serviceLocator.get('notificationsLib');

            return new PasswordService(serviceLocator.get('userService'), logger, notification);
        });

        /**
         * Creates an instance of the Passport Authentication Library
         */
        serviceLocator.register('passportAuthentication', (serviceLocator) => {
            let logger = serviceLocator.get('logger');
            let userService = serviceLocator.get('userService');
            let passwordService = serviceLocator.get('passwordService');

            return new PassportAuthentication(userService, passwordService, logger);
        });

        /**
         * Creates an instance of the admin controller
         */
        serviceLocator.register('adminController', (serviceLocator) => {
            let passwordService = serviceLocator.get('passwordService');
            let userService = serviceLocator.get('userService');
            let roleService = serviceLocator.get('roleService');
            let warehouseService = serviceLocator.get('warehouseService');
            let permissionService = serviceLocator.get('permissionService');
            let logger = serviceLocator.get('logger');

            return new AdminController(passwordService, userService, roleService, warehouseService,
                permissionService, logger);
        });

        /**
         * Creates an instance of the Home controller
         */
        serviceLocator.register('homeController', (serviceLocator) => {
            let passwordService = serviceLocator.get('passwordService');
            let logger = serviceLocator.get('logger');

            return new HomeController(passwordService, logger);
        });

        /**
         * Creates an instance of the Catalog Service HTTP Client
         */
        serviceLocator.register('catalogClient', (serviceLocator) => {

            let logger = serviceLocator.get('logger');
            let catalog = Catalog.create({
                base_url: config.web.catalog_service_url,
                timeout: config.web.catalog_service_timeout,
                logger: logger
            });

            return new CatalogClient(catalog, logger);
        });

        /**
         * Creates an instance of the Stock Service HTTP Client wrapper class
         */
        serviceLocator.register('stockServiceClient', (serviceLocator) => {

            let cache = serviceLocator.get('cache');
            let requestClient = new RequestClient(config.web.stock_request_service_url, cache);
            let logger = serviceLocator.get('logger');

            return new StockServiceClient(requestClient, logger);
        });

        /**
         * Creates an instance of the Inbound service
         */
        serviceLocator.register('inboundService', (serviceLocator) => {

            let logger = serviceLocator.get('logger');
            let inboundModel = serviceLocator.get('inboundModel');
            let paginator = serviceLocator.get('Paginator');
            let catalogClient = serviceLocator.get('catalogClient');

            return new InboundService(catalogClient, inboundModel, config, paginator, logger);
        });

        /**
         * Creates an instance of the Inbound controller
         */
        serviceLocator.register('inboundController', (serviceLocator) => {
            let inboundService = serviceLocator.get('inboundService');
            let userService = serviceLocator.get('userService');
            let logger = serviceLocator.get('logger');

            return new InboundController(inboundService, userService, logger);
        });

        /**
         * Creates an instance of the inbound model
         */
        serviceLocator.register('inboundModel', (serviceLocator) => {
            let catalogClient = serviceLocator.get('stockServiceClient');
            let logger = serviceLocator.get('logger');

            return new InboundModel(catalogClient, logger);
        });

        /**
         * Creates an instance of the Outbound Controller
         */
        serviceLocator.register('outboundModel', (serviceLocator) => {
            let stockServiceClient = serviceLocator.get('stockServiceClient');
            let logger = serviceLocator.get('logger');

            return new OutboundModel(stockServiceClient, logger);
        });

        /**
         * Creates an instance of the Outbound service
         */
        serviceLocator.register('outboundService', (serviceLocator) => {

            let logger = serviceLocator.get('logger');
            let outboundModel = serviceLocator.get('outboundModel');
            let paginator = serviceLocator.get('Paginator');
            let catalogServiceClient = serviceLocator.get('catalogClient');

            return new OutboundService(catalogServiceClient, outboundModel, config, paginator, logger);
        });

        /**
         * Creates an instance of the Outbound Controller
         */
        serviceLocator.register('outboundController', (serviceLocator) => {
            let outboundService = serviceLocator.get('outboundService');
            let userService = serviceLocator.get('userService');
            let logger = serviceLocator.get('logger');

            return new OutboundController(outboundService, userService, logger);
        });

        serviceLocator.register('notificationsLib', (serviceLocator) => {
            let oauth = serviceLocator.get('oauth');
            let logger = serviceLocator.get('logger');
            let tokenProviderConfig = { logger: logger };

            let provider = tokenProvider.create(oauth, config.oauth.scopes.hermes, 'hermes', tokenProviderConfig);
            let hermesConfig = {
                logger: logger,
                requestTimeoutMs: parseInt(config.services.hermes.timeout)
            };

            let hermes = new Hermes(config.services.hermes.url, provider, hermesConfig);

            return new NotificationLib(logger, hermes);
        });

        serviceLocator.register('outboundModel', (serviceLocator) => {
            let stockServiceClient = serviceLocator.get('stockServiceClient');
            let logger = serviceLocator.get('logger');

            return new OutboundModel(stockServiceClient, logger);
        });

        serviceLocator.register('authorizationMiddleware', (serviceLocator) => {
            let userService = serviceLocator.get('userService');
            let logger = serviceLocator.get('logger');

            return new AuthorizationLib(logger, userService);
        });

        serviceLocator.register('userService', (serviceLocator) => {
            let roleService = serviceLocator.get('roleService');
            let warehouseService = serviceLocator.get('warehouseService');
            let paginator = serviceLocator.get('Paginator');
            let logger = serviceLocator.get('logger');
            let cache = serviceLocator.get('cache');

            return new UserService(roleService, warehouseService, paginator,  logger, cache);
        });

        serviceLocator.register('roleService', (serviceLocator) => {
            let logger = serviceLocator.get('logger');
            let cache = serviceLocator.get('cache');

            return new RoleService(logger, cache);
        });

        serviceLocator.register('permissionService', (serviceLocator) => {
            let logger = serviceLocator.get('logger');
            let cache = serviceLocator.get('cache');

            return new PermissionService(logger, cache);
        });

        serviceLocator.register('warehouseService', (serviceLocator) => {
            let logger = serviceLocator.get('logger');
            let cache = serviceLocator.get('cache');

            return new WarehouseService(logger, cache);
        });

        return serviceLocator;
    }
};
