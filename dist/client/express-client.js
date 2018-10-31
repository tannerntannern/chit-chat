import axios from 'axios';
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
        return axios.request(config);
    };
    /**
     * Sends a GET request to the given endpoint.
     */
    ExpressClient.prototype.get = function (endpoint, config) {
        return axios.get(this.host + endpoint, config);
    };
    /**
     * Sends a DELETE request to the given endpoint.
     */
    ExpressClient.prototype.delete = function (endpoint, config) {
        return axios.delete(this.host + endpoint, config);
    };
    /**
     * Sends a HEAD request to the given endpoint.
     */
    ExpressClient.prototype.head = function (endpoint, config) {
        return axios.head(this.host + endpoint, config);
    };
    /**
     * Sends a POST request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.post = function (endpoint, args, config) {
        return axios.post(this.host + endpoint, args, config);
    };
    /**
     * Sends a PUT request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.put = function (endpoint, args, config) {
        return axios.put(this.host + endpoint, args, config);
    };
    /**
     * Sends a PATCH request to the given endpoint with the given arguments.
     */
    ExpressClient.prototype.patch = function (endpoint, args, config) {
        return axios.patch(this.host + endpoint, args, config);
    };
    return ExpressClient;
}());
export { ExpressClient };
