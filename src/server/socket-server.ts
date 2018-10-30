import * as http from 'http';
import * as socketio from 'socket.io';
import {HttpServer, HttpServerConfig} from './http-server';
import {SocketHandlers, SocketInterface} from '../interface/socket-interface';

/**
 * Defines how SocketServer may be configured.
 */
export type SocketServerConfig<API extends SocketInterface> = {
	ioOptions?: socketio.ServerOptions,
	namespaceConfig?: (namespace: socketio.Namespace, server: SocketServer<API>) => void
} & HttpServerConfig;

/**
 * Describes the shape of the `this` context that will be available in every SocketServer handler.
 */
export type HandlerCtx<API extends SocketInterface> = {
	server: SocketServer<API>,
	socket: socketio.Socket,
	nsp: socketio.Namespace
};

/**
 * A simple SocketServer with an API protected by TypeScript.
 */
export abstract class SocketServer<API extends SocketInterface> extends HttpServer {
	/**
	 * Socket.io server instance for managing socket communication.
	 */
	protected io: socketio.Server = null;

	/**
	 * Contains implementations for the events described by the API.  This guarantees compatibility with any
	 * SocketClient that implements the same API.
	 */
	protected abstract socketHandlers: SocketHandlers<API, 'server', HandlerCtx<API>>;

	/**
	 * Constructs a new SocketServer.
	 */
	constructor(options?: SocketServerConfig<API>) {
		super(options);
	}

	/**
	 * Default configuration values for all SocketServers.
	 */
	public getDefaultConfig() {
		let baseConfig = super.getDefaultConfig();

		Object.assign(baseConfig, {
			ioOptions: {},
			namespaceConfig: function(namespace, server) {}
		});

		return baseConfig;
	}

	/**
	 * Override to allow the options object to be of type SocketServerConfig.
	 */
	public configure(options: SocketServerConfig<API>){
		super.configure(options);
		return this;
	}

	/**
	 * Emits an event to the given target.  The typings ensure that only events defined in the API can be emitted.
	 */
	public emit<Event extends keyof API['server']>(target: socketio.Namespace | socketio.Socket, event: Event, ...args: API['server'][Event]['args']) {
		target.emit(<string> event, ...args);
	}

	/**
	 * Processes an incoming event with the appropriate socketHandler.  If the handler returns an EventResponse, the
	 * proper even will automatically be emitted.
	 */
	protected handleEvent(ctx: HandlerCtx<API>, event: string, ...args) {
		let response = this.socketHandlers[event].call(ctx, ...args);

		if (response) {
			this.emit(response.broadcast ? ctx.nsp : ctx.socket, response.name, ...response.args);
		}
	}

	/**
	 * Sets up the socket handlers for the given namespace.
	 */
	protected attachSocketHandlers(namespace: socketio.Namespace) {
		let handlers = this.socketHandlers;

		namespace.on('connection', socket => {
			// Build context for all handlers
			let ctx: HandlerCtx<API> = {
				server: this,
				socket: socket,
				nsp: namespace
			};

			// Call the connect event right away
			if ('connect' in handlers) {
				this.handleEvent(ctx, 'connect');
			}

			// Setup listeners for the other events
			for (let event in handlers)
				socket.on(event, (...args) => {
					this.handleEvent(ctx, event, ...args);
				});
		});
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
		if (nsps.indexOf(namespaceName) !== -1)
			throw new Error('The given namespace is already in use.');

		// Then create and init the namespace
		let nsp = this.io.of(namespaceName);
		this.config.namespaceConfig(nsp, this);
		this.attachSocketHandlers(nsp);
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

	/**
	 * Attaches a socket.io server to the internal Node http server.
	 */
	protected setup(httpServer: http.Server) {
		this.io = socketio(httpServer, this.config.ioOptions);
		this.config.ioConfig(this.io, this);
		this.attachSocketHandlers(this.io.nsps['/']);
	}

	/**
	 * Cleans up any socket-related junk.
	 */
	protected takedown() {
		this.io = null;
	}
}
