import * as _ from 'lodash';
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as socketio from 'socket.io';
import {Mixin} from '../lib/util/mixins';
import {ObjectOf} from "./util";
import {HttpInterface, HttpInterfaceMixin} from "./http-interface";
import {ServerSocketHandler, ServerSocketInterface, SocketInterfaceMixin} from "./socket-interface";

export type SocketServerConfig = {
	ioOptions?: { path?: string, serveClient?: boolean, adapter?: object, origins?: string, parser?: object },
	ioConfig?: (io, server) => void,
	namespaceConfig?: (namespace, server) => void
} & AbstractServerConfig;

export type ExpressSocketServerConfig = ExpressServerConfig & SocketServerConfig;

/**
 * Specifies additional shared functionality for SocketServers.
 */
export abstract class SocketServerMixin {
	/**
	 * Socket.io server instance for managing socket communication.
	 */
	protected io = null;

	/**
	 * This mixin makes the assumption that a config object will be available.
	 */
	protected abstract config;

	/**
	 * TODO: ...
	 */
	eventHandlers: {
		global: {},
		namespaced: {}
	};

	/**
	 * Initializes SocketHandlers from the socketInterfaces
	 */
	protected initSocketInterfaces(target, whichHandlers) {
		let that = this;

		// Wade through the socketInterfaces and build a list of handlers to be attached
		const { handlers, overridingHandlers } = this.resolveOverridingHandlers(whichHandlers);

		// Helper function for handling the result of handler
		function handleHandlerResult(result, socket){
			let nsp = result.broadcast ? target : socket;
			nsp.emit(result.name, ...result.args);
		}

		// Separate the connect handlers from the rest
		let connectHandlers = [];
		if ('connect' in handlers) {
			connectHandlers = handlers.connect;
			delete handlers.connect;
		} else if ('connect' in overridingHandlers) {
			connectHandlers = [overridingHandlers.connect];
			delete overridingHandlers.connect;
		}

		// Finally, apply all of the handlers
		target.on('connection', function(socket) {
			// Build context for all handlers
			let ctx = {
				server: that,
				socket: socket,
				io: target
			};

			// Call the connect event right away
			for (let handler of connectHandlers)
				handleHandlerResult(handler.call(ctx), socket);

			// Add overriding handlers
			for (let eventName in overridingHandlers){
				socket.on(eventName, function() {
					handleHandlerResult(
						overridingHandlers[eventName].apply(ctx, arguments),
						socket
					);
				});
			}

			// Add regular handlers
			for (let eventName in handlers) {
				for (let handler of handlers[eventName]) {
					socket.on(eventName, function() {
						handleHandlerResult(
							handler.apply(ctx, arguments),
							socket,
						);
					});
				}
			}
		});
	}

	/**
	 * Initializes the global socket event handlers.
	 */
	protected initGlobalHandlers() {
		this.initSocketInterfaces(this.io, 'global');
	}

	/**
	 * Initializes the namespaced socket event handlers.
	 */
	protected initSocketNamespaceInterfaces(nsp) {
		this.initSocketInterfaces(nsp, 'namespaced');
	}

	/**
	 * Returns a list of all the active namespaces on the socket server.
	 */
	public getNamespaces(): string[] {
		if (this.io === null)
			return [];
		else
			return Object.keys(this.io.nsps);
	}

	/**
	 * Adds a namespace to the socket server.  Throws an error if the namespace already exists.
	 */
	public addNamespace(name: string) {
		// Make namespace name to avoid confusion about the slash
		let namespaceName = '/' + name;

		// Make sure io is initialized
		if (this.io === null)
			throw new Error('The server must be running before namespaces can be added.');

		// First make sure the namespace isn't already taken
		let nsps = this.getNamespaces();
		if (_.includes(nsps, namespaceName))
			throw new Error('The given namespace is already in use.');

		// Then create and init the namespace
		let nsp = this.io.of(namespaceName);
		this.config.namespaceConfig(nsp, this);
		this.initSocketNamespaceInterfaces(nsp);
	}

	/**
	 * Removes a namespace from the socket server.
	 */
	public removeNamespace(name: string) {
		// Make namespace name to avoid confusion about the slash
		let namespaceName = '/' + name;

		// Make sure io is initialized
		if (this.io === null)
			throw new Error('The server must be running before namespaces can be removed.');

		// How to properly remove a namespace:  https://stackoverflow.com/a/36499839
		let nsp = this.io.of(namespaceName),
			connectedSockets = Object.keys(nsp.connected);

		connectedSockets.forEach(socketId => {
			nsp.connected[socketId].disconnect(); // Disconnect each socket
		});

		nsp.removeAllListeners();
		delete this.io.nsps[namespaceName];
	}
}

/**
 * A simple AbstractServer-compatible SocketServer.
 */
export class SocketServer extends Mixin<AbstractServer & SocketServerMixin>(AbstractServer, SocketServerMixin) {
	/**
	 * Http server instance that underlies socket.io
	 */
	protected httpServer = null;

	/**
	 * Constructs a new SocketServer.
	 */
	constructor(options?: SocketServerConfig) {
		// Applies configurations
		super(options);

		// Add default configurations
		this.fillDefaults({
			ioOptions: {},
			ioConfig: function(io, server) {},
			namespaceConfig: function(namespace, server) {}
		});
	}

	/**
	 * Override to allow the options object to be of type SocketServerConfig.
	 */
	protected fillDefaults(options: SocketServerConfig){
		super.fillDefaults(options);
	}

	/**
	 * Override to allow the options object to be of type SocketServerConfig.
	 */
	public configure(options: SocketServerConfig){
		super.configure(options);
	}

	/**
	 * Simply returns the name that the server should use to refer to itself.
	 */
	protected getName(): string {
		return 'SocketServer';
	}

	/**
	 * Starts the SocketServer.
	 */
	public start(callback?: Function) {
		// Initialize Socket.io server
		let that = this,
			cfg = this.config,
			httpServer = new http.Server(),
			io = socketio(httpServer, cfg.ioOptions);

		this.httpServer = httpServer;
		this.io = io;

		// Configure socket.io
		cfg.ioConfig(io, this);
		this.initGlobalHandlers();

		// Add default callback if not defined
		if (_.isUndefined(callback))
			callback = function () {
				console.info(that.getName() + ' listening on port ' + cfg.port);
			};

		// Start listening
		httpServer.listen(cfg.port, function(){
			that.running = true;
			callback();
		});
	}

	/**
	 * Stops the SocketServer.
	 */
	public stop(callback?: Function) {
		let that = this;

		// Add default callback if not defined
		if (_.isUndefined(callback))
			callback = function() {
				console.info('Stopped ' + that.getName() + ' on port ' + that.config.port);
			};

		// Stop socket communication...
		that.io.close(function(){
			// Then close the underlying httpServer...
			that.httpServer.close(function(){
				// Then reset and trigger the callback
				that.io = null;
				that.httpServer = null;
				that.running = false;
				callback();
			});
		});
	}
}

/**
 * An AbstractServer-compatible ExpressServer that shares resources with Socket.io.  Note that both of these connections
 * will use the same port.
 */
export class ExpressSocketServer extends Mixin<ExpressServer & SocketServerMixin>(ExpressServer, SocketServerMixin) {
	/**
	 * Constructs a new ExpressSocketServer
	 */
	constructor(options?: ExpressSocketServerConfig) {
		// Applies configurations
		super(options);

		// Add default configurations
		this.fillDefaults({
			ioOptions: {},
			ioConfig: function(io, server) {},
			namespaceConfig: function(namespace, server) {}
		});

		// Override default expressConfig
		this.configure({
			expressConfig: function(expressApp, server) {
				expressApp.get('/', function(req, res){
					res.send(
						'<h1>It Works!</h1>' +
						'<p>If you didn\'t specifically disable it, you should have access to io() in the console!</p>' +
						'<script src="/socket.io/socket.io.js"></script>'
					);
				});
			}
		});
	}

	/**
	 * Override to allow the options object to be of type ExpressSocketServerConfig.
	 */
	protected fillDefaults(options: ExpressSocketServerConfig){
		super.fillDefaults(options);
	}

	/**
	 * Override to allow the options object to be of type ExpressSocketServerConfig.
	 */
	public configure(options: ExpressSocketServerConfig){
		super.configure(options);
	}

	/**
	 * Simply returns the name that the server should use to refer to itself.
	 */
	protected getName(): string {
		return 'ExpressSocketServer';
	}

	/**
	 * Starts the ExpressSocketServer.
	 */
	public start(callback?: Function) {
		let cfg = this.config;

		// Call parent start() to init Express server
		super.start(callback);

		// Init and config socket.io server
		this.io = socketio(this.httpServer, cfg.ioOptions);
		cfg.ioConfig(this.io, this);
		this.initGlobalHandlers();
	}

	/**
	 * Stops the ExpressSocketServer.
	 */
	public stop(callback?: Function) {
		let that = this;

		// Add default callback if not defined
		if (_.isUndefined(callback))
			callback = function() {
				console.info('Stopped ' + that.getName() + ' on port ' + that.config.port);
			};

		// Stop socket communication...
		that.io.close(function(){
			// Then close the underlying httpServer...
			that.httpServer.close(function(){
				// Then reset and trigger the callback
				that.expressApp = null;
				that.httpServer = null;
				that.io = null;
				that.running = false;
				callback();
			});
		});
	}
}
