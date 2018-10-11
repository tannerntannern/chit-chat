import * as socketio from 'socket.io-client';
import {TransmitterStructure} from '../interface/socket-interface';

export class SocketClient<API extends TransmitterStructure> {
	/**
	 * TODO: ...
	 */
	protected io: SocketIOClient.Socket;

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
}