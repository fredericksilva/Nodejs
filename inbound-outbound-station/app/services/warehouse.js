'use strict';

let Warehouse = require('app/models/warehouse');

class WarehouseService{

    /**
     * @constructor
     *
     * @param logger
     * @param cache
     */
    constructor(logger, cache) {
        this.logger = logger;
        this.cache = cache;
    }

    /**
     * get warehouses
     *
     * @returns {Promise.<TResult>}
     */
    getWareHouses() {
        return new Warehouse().fetchAll().then(warehouses => { return warehouses.toJSON(); });
    }
}

module.exports = WarehouseService;
