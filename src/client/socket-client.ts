import {SocketHandlers, SocketInterface} from '../interface/socket-interface';
import {SocketMixin} from '../lib/socket-mixin';
import {Socket, ConnectOpts} from '../lib/types';
import * as _io from 'socket.io-client';

declare let window: any;

/**
 * Describes the shape of the `this` context that will be available in every SocketClient handler.
 */
export type HandlerCtx<API extends SocketInterface> = {
	socket: Socket,
	client: SocketClient<API>
};

/**
 * Basic socket client that can be used in Node or in the browser.
 */
export abstract class SocketClient<API extends SocketInterface> extends SocketMixin<API, 'client'> {
	/**
	 * Reference to the socket.io-client library.  If the client is running in the browser, it is assumed that `io` will
	 * be available on `window`.
	 */
	public static io: typeof _io = (typeof window !== 'undefined') && window.io ? window.io : null;

	/**
	 * Socket.io Socket instance for internal use.
	 */
	protected socket: Socket = null;

	/**
	 * Contains implementations for the events described by the API.  This guarantees compatibility with any
	 * SocketServer that implements the same API.
	 */
	protected abstract socketHandlers: SocketHandlers<API, 'client', HandlerCtx<API>>;

	/**
	 * Constructs a new SocketClient.
	 */
	constructor() {
		super();

		// Make sure we have a valid io reference
		if (!SocketClient.io) throw new Error(
			'Socket.io reference not detected.  If you are running in the browser, be sure to include the ' +
			'socket.io-client library beforehand.  If you are running under Node.js, you must assign the ' +
			'SocketClient.io property manually before instantiating a SocketClient.'
		);
	}

	/**
	 * Sets up the socket handlers for the client.
	 */
	protected attachSocketHandlers() {
		// Build context for all handlers
		let ctx: HandlerCtx<API> = {
			socket: this.socket,
			client: this
		};

		// Setup listeners for each event
		for (let event in this.socketHandlers)
			this.socket.on(event, (...args) => {
				this.handleEvent(ctx, event, ...args);
			});
	}

	/**
	 * Returns whether or not the client has an active socket connection.
	 */
	public isConnected() {
		return (this.socket !== null) && this.socket.connected;
	}

	/**
	 * Returns the socket id if the client is connected.
	 */
	public getSocketId(): string {
		if (this.isConnected())
			return this.socket.id;
		else
			throw new Error('The client must first be connected to get the socket id');
	}

	/**
	 * Attempts to connect to a SocketServer.
	 */
	public connect<WaitFor extends string | null>(url: string = '', waitFor: WaitFor = null, options?: ConnectOpts): WaitFor extends string ? Promise<any> : void {
		if (!options) options = {};
		Object.assign(options, {
			autoConnect: false
		});

		this.socket = SocketClient.io(url, options);
		this.attachSocketHandlers();
		this.socket.open();

		if (typeof waitFor === 'string')
			return <any>this.blockEvent(waitFor);
	}

	/**
	 * Disconnects from the SocketServer, if there was a connection.
	 */
	public disconnect() {
		if (this.socket) this.socket.close();
		this.socket = null;
	}

	/**
	 * Emits an event to the connected SocketServer.  TypeScript ensures that the event adheres to the API description.
	 */
	public emit<Event extends keyof API['client']>(event: Event, ...args: API['client'][Event]['args']) {
		this.socket.emit(<string>event, ...args);
	}

	/**
	 * Handles a Response that requires a reply.
	 */
	protected reply(ctx, response) {
		this.socket.emit(response.name, ...response.args);
	}
}