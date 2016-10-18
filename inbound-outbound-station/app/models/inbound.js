'use strict';

const HTTPStatus = require('http-status');

class Inbound {

    /**
     * @constructor
     *
     * @param stockServiceClient
     * @param logger
     */
    constructor(stockServiceClient, logger) {
        this.stockServiceClient = stockServiceClient;
        this.logger = logger;
    }

    /**
     * Wrapper to get all batches from api
     *
     * @param params
     * @returns {*}
     */
    getBatches(params) {
        return this.stockServiceClient.getBatches('inbound/', params.batch_number, params.limit, params.offset,
            params.warehouse).then(response => {

                if (response.statusCode === HTTPStatus.OK && (response.body && response.body.hasOwnProperty('data'))) {
                    return response.body;
                }

                throw new Error(`Error getting batch with params ${params} from Stock request service`);
            });
    }

    /**
     * Wrapper to get a single batch from api
     *
     * @param batchNumber
     * @returns {*}
     */
    getBatch(batchNumber) {
        if (!batchNumber) {
            throw new Error('Record Not found!');
        }

        return this.stockServiceClient.getBatch('inbound/' + batchNumber).then(response => {
            if (response.statusCode === HTTPStatus.OK && (response.body && response.body.hasOwnProperty('data'))) {
                return response.body;
            }

            throw new Error(`Error getting batch with batch number ${batchNumber} from Stock request service`);

        });
    }
}

module.exports = Inbound;
