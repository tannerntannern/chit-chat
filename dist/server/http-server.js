import * as http from 'http';
/**
 * Defines the common interface and shared functionality that all Servers should have.
 */
var HttpServer = /** @class */ (function () {
    /**
     * Constructs and configures a new HttpServer.
     */
    function HttpServer(options) {
        /**
         * Internal Node.js http server.
         */
        this.httpServer = null;
        // Apply default configurations
        this.config = this.getDefaultConfig();
        // Then apply configurations given to constructor
        this.configure(options);
    }
    /**
     * Default configuration values for all HttpServers.
     */
    HttpServer.prototype.getDefaultConfig = function () {
        return {
            host: 'localhost',
            port: 3000
        };
    };
    /**
     * Returns whether or not the server is running.
     */
    HttpServer.prototype.isRunning = function () {
        return this.httpServer !== null && this.httpServer.address() !== null;
    };
    /**
     * Applies configurations to the HttpServer.
     */
    HttpServer.prototype.configure = function (options) {
        if (this.isRunning())
            throw new Error('Cannot make configuration changes while the server is running!');
        Object.assign(this.config, options);
        return this;
    };
    /**
     * Starts the HttpServer and returns a Promise for when it's ready.
     */
    HttpServer.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.httpServer = http.createServer();
            _this.setup(_this.httpServer);
            _this.httpServer.listen(_this.config.port, function () {
                resolve(true);
            });
        });
    };
    /**
     * Stops the HttpServer and returns a Promise for when it's done.
     */
    HttpServer.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.httpServer.close(function () {
                _this.httpServer = null;
                _this.takedown();
                resolve(true);
            });
        });
    };
    return HttpServer;
}());
export { HttpServer };
