import * as socketio from 'socket.io-client';
import {SocketHandlers, SocketInterface} from '../interface/socket-interface';

/**
 * TODO: ...
 */
type HandlerCtx = {};

/**
 * Basic socket client that can be used in Node or in the browser.
 */
export abstract class SocketClient<API extends SocketInterface> {
	/**
	 * TODO: ...
	 */
	protected io: SocketIOClient.Socket;

	/**
	 * TODO: ...
	 */
	protected abstract socketHandlers: SocketHandlers<API, 'client', HandlerCtx>;

	/**
	 * TODO: ...
	 */
	public connect(url: string = '', options?: SocketIOClient.ConnectOpts): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.io = socketio.connect(url, options);
			this.io.once('connect', () => { resolve(true) });
			this.io.once('connect_failed', () => { resolve(false) });
		});
	}

	/**
	 * TODO: ...
	 */
	public emit<Event extends keyof API['client']>(event: Event, ...args: API['client'][Event]['args']) {
		// ...
	}
}