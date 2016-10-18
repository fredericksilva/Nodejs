'use strict';

var client = require('requestretry');
var config = require('../config/config');
var querystring = require('querystring');

var options = {
    json: true,
    fullResponse: true
};

class RequestClient {

    constructor(apiUrl, cache) {
        this.apiUrl = apiUrl;
        this.cache = cache;
    }

    /**
     * uses a GET method for returning data from an API
     *
     * @param path - the API path you are making a request
     * @param params - query parameters
     */
    get(path, params) {
        var query = querystring.stringify(params);
        options.url = this.apiUrl + path;
        if (query) {
            options.url += '?' + query;
        }

        options.maxAttempts = config.request_retry.max_attempts;
        options.retryDelay = config.request_retry.retry_delay;
        options.retryStrategy = client.RetryStrategies.HTTPOrNetworkError;
        return client.get(options);
    }

    /**
     * uses a POST method for returning data from an API
     *
     * @param path - the API path you are making a request
     * @param params - POST body parameters
     */
    post(path, params) {
        options.body = params;
        options.maxAttempts = 1;
        options.url = this.apiUrl + path;
        return client.post(options);
    }
}

module.exports = RequestClient;
