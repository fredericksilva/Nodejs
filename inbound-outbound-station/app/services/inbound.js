'use strict';

class InboundService {

    /**
     * @constructor
     *
     * @param catalogClient
     * @param inbound
     * @param config
     * @param paginator
     * @param logger
     */
    constructor(catalogClient, inbound, config, paginator, logger) {
        this.logger = logger;
        this.config = config;
        this.inbound = inbound;
        this.paginator = paginator;
        this.catalogClient = catalogClient;
    }

    /**
     * fetch inbound batches
     *
     * @param params
     * @return {*}
     */
    fetchBatches(params) {

        params.limit = this.config.pagination.default_limit;
        params.offset = this.config.pagination.default_offset;

        if (params.page) {
            params.offset = this.config.pagination.default_limit * (params.page - 1);
            delete params.page;
        }

        let batches = {};
        let pagination = {};

        return this.inbound.getBatches(params).then((resp) => {
            this.logger.info('Fetched batches from Stock Request Service', resp);

            if (resp.status !== 'success') {
                throw new Error('Error fetching data from service.');
            }

            batches = resp.data.batches;
            pagination = this.paginator.paginate({
                limit: resp.data.limit,
                offset: resp.data.offset,
                total: resp.data.total
            });

            if (batches.length !== 0) {
                let skuList = this.prepareProductItems(batches);
                this.logger.info('List of SKUs to pull from Catalog Service: ', skuList);

                // Fetches product items from catalog service
                return this.catalogClient.getBatch(skuList);
            }

            return resp;
        }).then((products) => {
            this.logger.info(`Fetched products from Catalog Service`, products);

            batches = this.addSellerDetailsToBatches(batches, products);

            return {
                batches: batches,
                pagination: pagination
            };
        });
    }

    /**
     * get inbound details for a batch number
     *
     * @param batchNo
     * @return {*}
     */
    fetchBatch(batchNo) {
        let batch = {};

        return this.inbound.getBatch(batchNo).then((resp) => {
            this.logger.info(`Fetched batch from Stock Request Service`, resp);

            if (resp.status !== 'success') {
                throw new Error(`Error fetching batch ${batchNo} from service.`);
            }

            batch = resp.data;

            if (batch.length !== 0) {
                let skuList = this.prepareProductItems([batch]);
                this.logger.info('List of SKUs to pull from Catalog Service: ', skuList);

                // Fetches product name and url from catalog service
                return this.catalogClient.getBatch(skuList);
            }

            return resp;
        }).then((products) => {
            this.logger.info(`Fetched products from Catalog Service`, products);

            batch = this.addProductDetailsToBatch(batch, products);
            return batch;
        });
    }

    /**
     * prepare product items
     *
     * @param batches
     * @return {Array}
     */
    prepareProductItems(batches) {
        let productIds = new Set();

        batches.forEach((batch) => {
            if (batch.items.length > 0) {
                if (batch.items[0].product_id)
                    productIds.add(batch.items[0].product_id);
            }
        });

        return Array.from(productIds);
    }

    /**
     * add seller details to batches
     *
     * @param batches
     * @param catalogProducts
     * @return {*}
     */
    addSellerDetailsToBatches(batches, catalogProducts) {
        let details = {};
        let sellerId = null;
        const sellerIdKey = 'seller.seller_id';
        const sellerNameKey = 'seller.seller_name';

        if (catalogProducts.length > 0) {
            catalogProducts.forEach(item => {
                sellerId = item[sellerIdKey];

                if (!details.hasOwnProperty(sellerId)) {
                    details[sellerId] = {};
                }

                details[sellerId].seller_id = item[sellerIdKey];
                details[sellerId].seller_name = item[sellerNameKey];
            });
        }

        batches.forEach((batch, index, arrBatches) => {
            if (details[batch.merchant_id]) {
                arrBatches[index].merchant_name = details[batch.merchant_id].seller_name;
            }
        });

        return batches;
    }

    /**
     * add product details to a batch
     *
     * @param batch
     * @param catalogProducts
     * @return {*}
     */
    addProductDetailsToBatch(batch, catalogProducts) {
        let details = {};
        let productId = null;

        if (catalogProducts.length > 0) {
            catalogProducts.forEach(item => {
                productId = item.sku;

                if (!details.hasOwnProperty(productId)) {
                    details[productId] = {};
                }

                details[productId].product_id = item.sku;
                details[productId].name = item.name;
                details[productId].image = this.config.web.image_service_url + item.images;
            });
        }

        batch.items.forEach((item, index, arrItems) => {
            if (details[item.product_id]) {
                arrItems[index].product_name = details[item.product_id].name;
                arrItems[index].image = details[item.product_id].image;
            }
        });

        return batch;
    }
}

module.exports = InboundService;
