"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var socketio = require("socket.io");
var http_server_1 = require("./http-server");
var socket_mixin_1 = require("../lib/socket-mixin");
var ts_mixer_1 = require("ts-mixer");
/**
 * A simple SocketServer with an API protected by TypeScript.
 */
// @ts-ignore: abstract class, but it's ok
var SocketServerManager = /** @class */ (function (_super) {
    __extends(SocketServerManager, _super);
    /**
     * Constructs a new SocketServerManager.
     */
    function SocketServerManager(options) {
        var _this = _super.call(this, options) || this;
        /**
         * Socket.io server instance for managing socket communication.
         */
        _this.io = null;
        return _this;
    }
    /**
     * Returns the default configuration for a SocketServerManager.
     */
    SocketServerManager.getDefaultConfig = function () {
        return Object.assign(_super.getDefaultConfig.call(this), {
            ioOptions: {},
            namespaceConfig: function (namespace, server) { }
        });
    };
    /**
     * Configures the SocketServerManager.
     */
    SocketServerManager.prototype.configure = function (options) {
        // @ts-ignore: ServerManager mixin
        _super.prototype.configure.call(this, options);
        return this;
    };
    /**
     * Emits an event to the given target.  The typings ensure that only events defined in the API can be emitted.
     */
    SocketServerManager.prototype.emit = function (target, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        target.emit.apply(target, [event].concat(args));
        return this;
    };
    /**
     * Handles a Response that requires a reply.
     */
    SocketServerManager.prototype.reply = function (ctx, response) {
        this.emit.apply(this, [response.broadcast ? ctx.nsp : ctx.socket, response.name].concat(response.args));
    };
    /**
     * Sets up the socket handlers for the given namespace.
     */
    SocketServerManager.prototype.attachSocketHandlers = function (namespace) {
        var _this = this;
        var handlers = this.socketHandlers;
        namespace.on('connection', function (socket) {
            // Build context for all handlers
            var ctx = {
                manager: _this,
                socket: socket,
                nsp: namespace
            };
            // Call the connect event right away
            // Note that if the client wishes to connect directly to a namespace (not '/'), the connection event on the
            // '/' namespace will still be called (socket.io's fault), which may not be desired.  This can be avoided by
            // passing a '?nsp_connect=true' parameter when connecting.
            if ('connect' in handlers && !(namespace.name === '/' && socket.handshake.query.nsp_connect)) {
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
    SocketServerManager.prototype.getNamespaces = function () {
        if (this.io === null)
            return [];
        else
            return Object.keys(this.io.nsps);
    };
    /**
     * Adds a namespace to the socket server.  Throws an error if the namespace already exists.
     */
    SocketServerManager.prototype.addNamespace = function (name) {
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
        return this;
    };
    /**
     * Removes a namespace from the socket server.
     */
    SocketServerManager.prototype.removeNamespace = function (name) {
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
        return this;
    };
    /**
     * Attaches a socket.io server to the internal Node http server.
     */
    SocketServerManager.prototype.setup = function (httpServer) {
        this.io = socketio(httpServer, this.config.ioOptions);
        var rootNamespace = this.io.nsps['/'];
        this.config.namespaceConfig(rootNamespace, this);
        this.attachSocketHandlers(rootNamespace);
    };
    /**
     * Cleans up any socket-related junk.
     */
    SocketServerManager.prototype.takedown = function () {
        this.io = null;
    };
    SocketServerManager = __decorate([
        ts_mixer_1.MixinDecorator(socket_mixin_1.SocketMixin)
    ], SocketServerManager);
    return SocketServerManager;
}(http_server_1.ServerManager));
exports.SocketServerManager = SocketServerManager;
