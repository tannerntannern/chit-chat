import * as http from 'http';
import * as socketio from 'socket.io';
import {AbstractServer, AbstractServerConfig} from './abstract-server';
import {SocketInterface, TransmitterStructure} from '../interface/socket-interface';

/**
 * Defines how SocketServer may be configured.
 */
export type SocketServerConfig<API extends TransmitterStructure> = {
	serverOptions?: socketio.ServerOptions,
	namespaceConfig?: (namespace: socketio.Namespace, server: SocketServer<API>) => void
} & AbstractServerConfig;

/**
 * Describes the shape of the `this` context that will be available in every SocketServer handler.
 */
type HandlerCtx<API extends TransmitterStructure> = {
	server: SocketServer<API>,
	socket: socketio.Socket,
	nsp: socketio.Namespace
};

/**
 * A simple SocketServer with an API protected by TypeScript.
 */
export abstract class SocketServer<API extends TransmitterStructure> extends AbstractServer {
	/**
	 * Socket.io server instance for managing socket communication.
	 */
	protected io: socketio.Server = null;

	/**
	 * Contains implementations for the events described by the API.  This guarantees compatibility with any
	 * SocketClient that implements the same API.
	 */
	protected abstract socketHandlers: SocketInterface<API, 'server', HandlerCtx<API>>;

	/**
	 * Constructs a new SocketServer.
	 */
	constructor(options?: SocketServerConfig<API>) {
		super(options);
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
	 * Starts the SocketServer.
	 */
	public start(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			// Initialize Socket.io server
			let cfg = this.config,
				httpServer = new http.Server(),
				io = socketio(httpServer, cfg.ioOptions);

			this.httpServer = httpServer;
			this.io = io;

			// Configure socket.io
			cfg.ioConfig(io, this);
			this.attachSocketHandlers(io.nsps['/']);

			// Start listening
			httpServer.listen(cfg.port, () => {
				this.running = true;
				resolve(true);
			});
		});
	}

	/**
	 * Stops the SocketServer.
	 */
	public stop(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.io.close(() => {
				this.io = null;
				this.httpServer = null;
				this.running = false;
				resolve(true);
			});
		});
	}
}
