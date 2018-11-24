"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
/**
 * Basic AJAX class than can be used in Node or the browser.  Essentially just wraps around some axios methods and
 * provides the proper typing based on the given HttpInterface, so that no requests are malformed.
 */
var ExpressClient = /** @class */ (function () {
    /**
     * Constructs a new ExpressClient.
     */
    function ExpressClient(host) {
        if (host === void 0) { host = ''; }
        this.host = host;
    }
    /**
     * General HTTP request method.
     */
    ExpressClient.prototype.request = function (endpoint, config) {
        Object.assign(config, {
            url: this.host + endpoint
        });
        return axios_1.default.request(config);
    };
    /**
     * Sends a GET request to the given endpoint.  Note that since GET requests cannot have a body, the args are passed
     * as query parameters.
     */
    ExpressClient.prototype.get = function (endpoint, args, config) {
        if (config === undefined)
            config = {};
        config.params = args;
        return axios_1.default.get(this.host + endpoint, config);
    };
    /**
     * Sends a DELETE request to the given endpoint.  Note that since DELETE requests cannot have a body, the args are
     * passed as query parameters.
     */
    ExpressClient.prototype.delete = function (endpoint, args, config) {
        if (config === undefined)
            config = {};
        config.params = args;
        return axios_1.default.delete(this.host + endpoint, config);
    };
    /**
     * Sends a POST request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.post = function (endpoint, args, config) {
        return axios_1.default.post(this.host + endpoint, args, config);
    };
    /**
     * Sends a PUT request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.put = function (endpoint, args, config) {
        return axios_1.default.put(this.host + endpoint, args, config);
    };
    /**
     * Sends a PATCH request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.patch = function (endpoint, args, config) {
        return axios_1.default.patch(this.host + endpoint, args, config);
    };
    return ExpressClient;
}());
exports.ExpressClient = ExpressClient;
