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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var http_server_1 = require("./http-server");
/**
 * A simple HTTP server built on Express, with an API protected by TypeScript.
 *
 * It should be noted that although this server is powered by Express, little effort is made to elegantly wrap around
 * the numerous features that Express provides.  The goal of this server is to provide basic bootstrapping for express
 * and to implement an interface that can also be implemented by an ExpressClient to ensure that both communicate with
 * each other properly.
 */
var ExpressServerManager = /** @class */ (function (_super) {
    __extends(ExpressServerManager, _super);
    /**
     * Constructs a new ExpressServerManager.
     */
    function ExpressServerManager(options) {
        return _super.call(this, options) || this;
    }
    /**
     * Returns the default configuration for an ExpressServerManager.
     */
    ExpressServerManager.getDefaultConfig = function () {
        return Object.assign(_super.getDefaultConfig.call(this), {
            priority: 1,
            expressConfig: function (expressApp, manager) {
                expressApp.get('/', function (req, res) {
                    res.send('<h1>It Works!</h1>' +
                        '<p>The next step is to configure the server for your needs.</p>');
                });
            },
            serveStaticDir: null
        });
    };
    /**
     * Configures the ExpressServerManager.
     */
    ExpressServerManager.prototype.configure = function (options) {
        // @ts-ignore: ServerManager mixin
        _super.prototype.configure.call(this, options);
        return this;
    };
    /**
     * Configures an Express instance and attaches it to the given httpServer.
     */
    ExpressServerManager.prototype.setup = function (httpServer) {
        // Create express instance
        var app = express(), cfg = this.config;
        // Add middleware for parsing post requests
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        // Add user Express configurations
        cfg.expressConfig(app, this);
        // Init the handlers
        var that = this;
        var _loop_1 = function (methodName) {
            var methodGroup = this_1.httpHandlers[methodName], argsKey = (methodName === 'put' || methodName === 'post' || methodName === 'patch') ? 'body' : 'query';
            var _loop_2 = function (handlerName) {
                app[methodName](handlerName, function (req, res) {
                    var handler = methodGroup[handlerName], ctx = { req: req, res: res, manager: that };
                    var response = handler.call(ctx, req[argsKey]);
                    res.send(response);
                });
            };
            for (var handlerName in methodGroup) {
                _loop_2(handlerName);
            }
        };
        var this_1 = this;
        for (var methodName in this.httpHandlers) {
            _loop_1(methodName);
        }
        // Add config for serving a static directory
        if (cfg.serveStaticDir !== null)
            app.use(express.static(cfg.serveStaticDir));
        // Attach the express app to the httpServer
        httpServer.on('request', app);
    };
    /**
     * Performs any necessary cleanup.
     */
    ExpressServerManager.prototype.takedown = function () {
        // Nothing to clean up
    };
    return ExpressServerManager;
}(http_server_1.ServerManager));
exports.ExpressServerManager = ExpressServerManager;
