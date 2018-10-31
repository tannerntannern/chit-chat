var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as socketio from 'socket.io';
import { HttpServer } from './http-server';
/**
 * A simple SocketServer with an API protected by TypeScript.
 */
var SocketServer = /** @class */ (function (_super) {
    __extends(SocketServer, _super);
    /**
     * Constructs a new SocketServer.
     */
    function SocketServer(options) {
        var _this = _super.call(this, options) || this;
        /**
         * Socket.io server instance for managing socket communication.
         */
        _this.io = null;
        return _this;
    }
    /**
     * Default configuration values for all SocketServers.
     */
    SocketServer.prototype.getDefaultConfig = function () {
        var baseConfig = _super.prototype.getDefaultConfig.call(this);
        Object.assign(baseConfig, {
            ioOptions: {},
            namespaceConfig: function (namespace, server) { }
        });
        return baseConfig;
    };
    /**
     * Override to allow the options object to be of type SocketServerConfig.
     */
    SocketServer.prototype.configure = function (options) {
        _super.prototype.configure.call(this, options);
        return this;
    };
    /**
     * Emits an event to the given target.  The typings ensure that only events defined in the API can be emitted.
     */
    SocketServer.prototype.emit = function (target, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        target.emit.apply(target, [event].concat(args));
    };
    /**
     * Processes an incoming event with the appropriate socketHandler.  If the handler returns an EventResponse, the
     * proper even will automatically be emitted.
     */
    SocketServer.prototype.handleEvent = function (ctx, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var _a;
        var response = (_a = this.socketHandlers[event]).call.apply(_a, [ctx].concat(args));
        if (response) {
            this.emit.apply(this, [response.broadcast ? ctx.nsp : ctx.socket, response.name].concat(response.args));
        }
    };
    /**
     * Sets up the socket handlers for the given namespace.
     */
    SocketServer.prototype.attachSocketHandlers = function (namespace) {
        var _this = this;
        var handlers = this.socketHandlers;
        namespace.on('connection', function (socket) {
            // Build context for all handlers
            var ctx = {
                server: _this,
                socket: socket,
                nsp: namespace
            };
            // Call the connect event right away
            if ('connect' in handlers) {
                _this.handleEvent(ctx, 'connect');
            }
            var _loop_1 = function (event) {
                socket.on(event, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this.handleEvent.apply(_this, [ctx, event].concat(args));
                });
            };
            // Setup listeners for the other events
            for (var event in handlers) {
                _loop_1(event);
            }
        });
    };
    /**
     * Returns a list of all the active namespaces on the socket server.
     */
    SocketServer.prototype.getNamespaces = function () {
        if (this.io === null)
            return [];
        else
            return Object.keys(this.io.nsps);
    };
    /**
     * Adds a namespace to the socket server.  Throws an error if the namespace already exists.
     */
    SocketServer.prototype.addNamespace = function (name) {
        // Make namespace name to avoid confusion about the slash
        var namespaceName = '/' + name;
        // Make sure io is initialized
        if (this.io === null)
            throw new Error('The server must be running before namespaces can be added.');
        // First make sure the namespace isn't already taken
        var nsps = this.getNamespaces();
        if (nsps.indexOf(namespaceName) !== -1)
            throw new Error('The given namespace is already in use.');
        // Then create and init the namespace
        var nsp = this.io.of(namespaceName);
        this.config.namespaceConfig(nsp, this);
        this.attachSocketHandlers(nsp);
    };
    /**
     * Removes a namespace from the socket server.
     */
    SocketServer.prototype.removeNamespace = function (name) {
        // Make namespace name to avoid confusion about the slash
        var namespaceName = '/' + name;
        // Make sure io is initialized
        if (this.io === null)
            throw new Error('The server must be running before namespaces can be removed.');
        // How to properly remove a namespace:  https://stackoverflow.com/a/36499839
        var nsp = this.io.of(namespaceName), connectedSockets = Object.keys(nsp.connected);
        connectedSockets.forEach(function (socketId) {
            nsp.connected[socketId].disconnect(); // Disconnect each socket
        });
        nsp.removeAllListeners();
        delete this.io.nsps[namespaceName];
    };
    /**
     * Attaches a socket.io server to the internal Node http server.
     */
    SocketServer.prototype.setup = function (httpServer) {
        this.io = socketio(httpServer, this.config.ioOptions);
        this.config.ioConfig(this.io, this);
        this.attachSocketHandlers(this.io.nsps['/']);
    };
    /**
     * Cleans up any socket-related junk.
     */
    SocketServer.prototype.takedown = function () {
        this.io = null;
    };
    return SocketServer;
}(HttpServer));
export { SocketServer };
