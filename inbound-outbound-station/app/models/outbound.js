'use strict';

const HTTPStatus = require('http-status');

class Outbound {

    constructor(stockServiceClient, logger) {
        this.stockServiceClient = stockServiceClient;
        this.logger = logger;
    }

    getBatches(params) {
        return this.stockServiceClient.getBatches('outbound/', params.batch_number, params.limit, params.offset,
            params.warehouse).then(response => {

                if (response.statusCode === HTTPStatus.OK && (response.body && response.body.hasOwnProperty('data'))) {
                    return response.body;
                }

                throw new Error(`Error getting batch with params ${params} from Stock request service`);
            });
    }

    getBatch(batchNumber) {
        if (!batchNumber) {
            throw new Error('Record Not found!');
        }

        return this.stockServiceClient.getBatch('outbound/' + batchNumber).then(response => {
            if (response.statusCode === HTTPStatus.OK && (response.body && response.body.hasOwnProperty('data'))) {
                return response.body;
            }

            throw new Error(`Error getting batch with batch number ${batchNumber} from Stock request service`);

        });
    }
}

module.exports = Outbound;
