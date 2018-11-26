"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
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
        this.serverManagers = {};
        /**
         * Where the HttpServer configurations are stored.
         */
        this.config = {
            host: 'localhost',
            port: 3000
        };
        this.configure(options);
    }
    HttpServer.prototype.attach = function (p1, p2) {
        // Force the overloads into a single case
        var managers;
        if (typeof p1 === 'string') {
            managers = {};
            managers[p1] = p2;
        }
        else {
            managers = p1;
        }
        // Add the managers and assign their internal `peers` property
        for (var key in managers) {
            var manager = managers[key];
            manager.peers = this.serverManagers;
            this.serverManagers[key] = manager;
        }
        return this;
    };
    HttpServer.prototype.with = function (p1, p2) {
        // @ts-ignore: since `with` is an alias, this is fine
        return this.attach(p1, p2);
    };
    /**
     * Returns the ServerManager with the given name.
     */
    HttpServer.prototype.getManager = function (key) {
        return this.serverManagers[key];
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
            for (var name in _this.serverManagers)
                _this.serverManagers[name].setup(_this.httpServer);
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
                for (var name in _this.serverManagers)
                    _this.serverManagers[name].takedown();
                resolve(true);
            });
        });
    };
    return HttpServer;
}());
exports.HttpServer = HttpServer;
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
     * Modifies the internal config object.
     */
    ServerManager.prototype.configure = function (options) {
        Object.assign(this.config, options);
        return this;
    };
    /**
     * Since there can be multiple managers on an HttpServer, one manager may wish to communicate with another.  This
     * function will return one of the other managers by name.
     */
    ServerManager.prototype.getPeer = function (name) {
        return this.peers[name];
    };
    return ServerManager;
}());
exports.ServerManager = ServerManager;
