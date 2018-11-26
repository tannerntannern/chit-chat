"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // Make sure we have a valid axios reference
        if (!ExpressClient.axios)
            throw new Error('Axios reference not detected.  If you are running in the browser, be sure to include the axios ' +
                'library beforehand.  If you are running under Node.js, you must assign the ExpressClient.axios property ' +
                'manually before instantiating an ExpressClient.');
    }
    /**
     * General HTTP request method.
     */
    ExpressClient.prototype.request = function (endpoint, config) {
        Object.assign(config, {
            url: this.host + endpoint
        });
        return ExpressClient.axios.request(config);
    };
    /**
     * Sends a GET request to the given endpoint.  Note that since GET requests cannot have a body, the args are passed
     * as query parameters.
     */
    ExpressClient.prototype.get = function (endpoint, args, config) {
        if (config === undefined)
            config = {};
        config.params = args;
        return ExpressClient.axios.get(this.host + endpoint, config);
    };
    /**
     * Sends a DELETE request to the given endpoint.  Note that since DELETE requests cannot have a body, the args are
     * passed as query parameters.
     */
    ExpressClient.prototype.delete = function (endpoint, args, config) {
        if (config === undefined)
            config = {};
        config.params = args;
        return ExpressClient.axios.delete(this.host + endpoint, config);
    };
    /**
     * Sends a POST request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.post = function (endpoint, args, config) {
        return ExpressClient.axios.post(this.host + endpoint, args, config);
    };
    /**
     * Sends a PUT request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.put = function (endpoint, args, config) {
        return ExpressClient.axios.put(this.host + endpoint, args, config);
    };
    /**
     * Sends a PATCH request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.patch = function (endpoint, args, config) {
        return ExpressClient.axios.patch(this.host + endpoint, args, config);
    };
    /**
     * Reference to the axios library.  If the client is running in the browser, it is assumed that axios will be
     * available on `window`.
     */
    ExpressClient.axios = (typeof window !== 'undefined') && window.axios ? window.axios : null;
    return ExpressClient;
}());
exports.ExpressClient = ExpressClient;
