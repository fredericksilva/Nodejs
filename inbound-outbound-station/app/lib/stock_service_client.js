'use strict';

class StockServiceClient{

    /**
     * @constructor
     *
     * @param requestClient
     * @param logger
     */
    constructor(requestClient, logger) {
        this.requestClient = requestClient;
        this.logger = logger;
    }

    /**
     * Get all batches corresponding to a given resource URL and arguments
     *
     * @param resourceUrl
     * @param batchNumber
     * @param limit
     * @param offset
     * @param warehouse
     * @returns {*}
     */
    getBatches(resourceUrl, batchNumber, limit, offset, warehouse) {
        let requestParams = {};

        requestParams.limit = limit;
        requestParams.offset = offset;

        if (warehouse) {
            requestParams.warehouse = warehouse;
        }

        if (batchNumber) {
            requestParams.batch_number = batchNumber;
        }

        return this.requestClient.get(resourceUrl, requestParams);
    }

    /**
     * Get single batch
     *
     * @param resourceUrl
     * @returns {*}
     */
    getBatch(resourceUrl) {
        return this.requestClient.get(resourceUrl);
    }

}

module.exports = StockServiceClient;
