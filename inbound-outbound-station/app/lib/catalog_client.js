'use strict';

class CatalogClient {

    /**
     * @constructor
     *
     * @param catalog
     * @param logger
     */
    constructor(catalog, logger) {
        this.catalog = catalog;
        this.logger = logger;
    }

    /**
     *  Get a list of product from the catalog service
     *
     * @param {array} skus - Array list of skus
     * @return {*}
     */
    getBatch(skus) {

        if (skus.length === 0) {
            return Promise.resolve([]);
        }

        let fields = ['sku', 'seller.seller_id', 'images,', 'seller.seller_name', 'name'];

        return new Promise((resolve, reject) => {

            this.catalog.getBatch(skus, fields, (err, data) => {

                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }
}

module.exports = CatalogClient;
