import * as http from 'http';
import * as socketio from 'socket.io';
import {HttpServer, HttpServerConfig, ServerManager} from './http-server';
import {SocketHandlers, SocketInterface} from '../interface/socket-interface';
import {SocketMixin} from '../lib/socket-mixin';
import {MixinDecorator} from 'ts-mixer';

/**
 * Defines how SocketServer may be configured.
 */
export type SocketServerManagerConfig<API extends SocketInterface> = {
	ioOptions?: socketio.ServerOptions,
	namespaceConfig?: (namespace: socketio.Namespace, server: SocketServerManager<API>) => void
};

/**
 * Describes the shape of the `this` context that will be available in every SocketServer handler.
 */
export type HandlerCtx<API extends SocketInterface> = {
	server: SocketServerManager<API>,
	socket: socketio.Socket,
	nsp: socketio.Namespace
};

/**
 * A simple SocketServer with an API protected by TypeScript.
 */
// @ts-ignore: abstract class, but it's ok
@MixinDecorator(SocketMixin)
abstract class SocketServerManager<API extends SocketInterface> extends ServerManager {
	/**
	 * Socket.io server instance for managing socket communication.
	 */
	protected io: socketio.Server = null;

	/**
	 * Default configuration values for all SocketServers.
	 */
	protected config: SocketServerManagerConfig<API> = {
		ioOptions: {},
		namespaceConfig: function(namespace, server) {}
	};

	/**
	 * Contains implementations for the events described by the API.  This guarantees compatibility with any
	 * SocketClient that implements the same API.
	 */
	protected abstract socketHandlers: SocketHandlers<API, 'server', HandlerCtx<API>>;

	/**
	 * Configures the SocketServerManager.
	 */
	public configure(options: SocketServerManagerConfig<API>): this {
		// @ts-ignore: ServerManager mixin
		super.configure(options);
		return this;
	}

	/**
	 * Emits an event to the given target.  The typings ensure that only events defined in the API can be emitted.
	 */
	public emit<Event extends keyof API['server']>(target: socketio.Namespace | socketio.Socket, event: Event, ...args: API['server'][Event]['args']): this {
		target.emit(<string> event, ...args);
		return this;
	}

	/**
	 * Handles a Response that requires a reply.
	 */
	protected reply(ctx: HandlerCtx<API>, response) {
		this.emit(response.broadcast ? ctx.nsp : ctx.socket, response.name, ...response.args);
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
	public addNamespace(name: string): this {
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

		return this;
	}

	/**
	 * Removes a namespace from the socket server.
	 */
	public removeNamespace(name: string): this {
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

		return this;
	}

	/**
	 * Attaches a socket.io server to the internal Node http server.
	 */
	public setup(httpServer: http.Server) {
		this.io = socketio(httpServer, this.config.ioOptions);

		let rootNamespace = this.io.nsps['/'];
		this.config.namespaceConfig(rootNamespace, this);
		this.attachSocketHandlers(rootNamespace);
	}

	/**
	 * Cleans up any socket-related junk.
	 */
	public takedown() {
		this.io = null;
	}
}

interface SocketServerManager<API extends SocketInterface> extends SocketMixin<API, 'server'> {}

export {
	SocketServerManager
};