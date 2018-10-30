import * as http from 'http';
import {SocketInterface} from '../interface/socket-interface';
import {HttpInterface} from '../interface/http-interface';
import {SocketServer, SocketServerConfig} from './socket-server';
import {ExpressServer, ExpressServerConfig} from './express-server';
import {MixinDecorator} from 'ts-mixer';

/**
 * Defines how a SocketExpressServer may be configured.
 */
export type SocketExpressServerConfig<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> = SocketServerConfig<SocketAPI> & ExpressServerConfig<HttpAPI>;

interface SocketExpressServer<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> extends SocketServer<SocketAPI>, ExpressServer<HttpAPI> {
	configure(options?: SocketExpressServerConfig<SocketAPI, HttpAPI>);
}

/**
 * Simply mixes SocketServer and ExpressServer together into one class.
 */
// @ts-ignore: We know that SocketServer is abstract and we want it to stay that way
@MixinDecorator(SocketServer, ExpressServer)
abstract class SocketExpressServer<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> {
	/**
	 * Constructs a new SocketExpress Server.
	 */
	constructor(options?: SocketExpressServerConfig<SocketAPI, HttpAPI>) {
		// @ts-ignore: we know there is a super
		super(options); // eslint-disable-line
	}

	/**
	 * Calls SocketServer#setup and ExpressServer#setup in succession to prevent them from overriding each other.
	 */
	protected setup(httpServer: http.Server) {
		// @ts-ignore: we know setup is protected and we want it to stay that way
		SocketServer.prototype.setup(httpServer);
		// @ts-ignore: we know setup is protected and we want it to stay that way
		ExpressServer.prototype.setup(httpServer);
	}

	/**
	 * Calls SocketServer#takedown and ExpressServer#takedown in succession to prevent them from overriding each other.
	 */
	protected takedown() {
		// @ts-ignore: we know takedown is protected and we want it to stay that way
		SocketServer.prototype.takedown();
		// @ts-ignore: we know takedown is protected and we want it to stay that way
		ExpressServer.prototype.takedown();
	}
}

export {
	SocketExpressServer // Export both class and interface under one name
};
