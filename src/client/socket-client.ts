import * as socketio from 'socket.io-client';
import {SocketHandlers, SocketInterface} from '../interface/socket-interface';
import {SocketMixin} from '../lib/socket-mixin';

/**
 * Describes the shape of the `this` context that will be available in every SocketClient handler.
 */
export type HandlerCtx<API extends SocketInterface> = {
	socket: SocketIOClient.Socket,
	client: SocketClient<API>
};

/**
 * Basic socket client that can be used in Node or in the browser.
 */
export abstract class SocketClient<API extends SocketInterface> extends SocketMixin<API, 'client'> {
	/**
	 * Socket.io Socket instance for internal use.
	 */
	protected socket: SocketIOClient.Socket = null;

	/**
	 * Contains implementations for the events described by the API.  This guarantees compatibility with any
	 * SocketServer that implements the same API.
	 */
	protected abstract socketHandlers: SocketHandlers<API, 'client', HandlerCtx<API>>;

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
	public connect<WaitFor extends string | null>(url: string = '', waitFor: WaitFor = null, options?: SocketIOClient.ConnectOpts): WaitFor extends string ? Promise<any> : void {
		if (!options) options = {};
		Object.assign(options, {
			autoConnect: false
		});

		this.socket = socketio(url, options);
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