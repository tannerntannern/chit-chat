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
        /**
         * List of ServerManagers in charge of the server.
         */
        this.serverManagers = [];
        /**
         * Where the HttpServer configurations are stored.
         */
        this.config = {
            host: 'localhost',
            port: 3000
        };
        this.configure(options);
    }
    /**
     * Attaches a ServerManager to this server.
     */
    HttpServer.prototype.attach = function () {
        var managers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            managers[_i] = arguments[_i];
        }
        var _a;
        (_a = this.serverManagers).push.apply(_a, managers);
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
            for (var _i = 0, _a = _this.serverManagers; _i < _a.length; _i++) {
                var manager = _a[_i];
                manager.setup(_this.httpServer);
            }
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
                for (var _i = 0, _a = _this.serverManagers; _i < _a.length; _i++) {
                    var manager = _a[_i];
                    manager.takedown();
                }
                resolve(true);
            });
        });
    };
    return HttpServer;
}());
export { HttpServer };
/**
 * A special class that can be attached to HttpServers to manage them; the "management" part must be implemented.
 */
var ServerManager = /** @class */ (function () {
    /**
     * Constructs a new ServerManager and applies any additional configurations.
     */
    function ServerManager(options) {
        /**
         * Where configs specific to the ServerManager are stored.
         */
        this.config = {};
        this.configure(options);
    }
    /**
     * Convenience method that constructs a new HttpServer with a ServerManager attached to it.
     */
    ServerManager.makeServer = function (serverConfig, managerConfig) {
        // @ts-ignore: instantiating abstract class
        var manager = new this(managerConfig), server = new HttpServer(serverConfig);
        server.attach(manager);
        return {
            server: server,
            manager: manager
        };
    };
    /**
     * Modifies the internal config object.
     */
    ServerManager.prototype.configure = function (options) {
        Object.assign(this.config, options);
        return this;
    };
    return ServerManager;
}());
export { ServerManager };
