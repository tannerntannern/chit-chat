import * as http from 'http';
import {HttpInterface, HttpHandlers} from '../interface/http-interface';
import {SocketInterface} from '../interface/socket-interface';
import {SocketServer, SocketServerConfig} from './socket-server';
import {ExpressServer, ExpressServerConfig, HandlerCtx as ExpressHandlerCtx} from './express-server';

/**
 * Defines how a SocketExpressServer may be configured.
 */
export type SocketExpressServerConfig<HttpAPI extends HttpInterface, SocketAPI extends SocketInterface> =
	ExpressServerConfig<HttpAPI> & SocketServerConfig<SocketAPI>;

/**
 * A modified version of SocketServer that includes functionality from ExpressServer.  There may be cases where you
 * want a SocketServer, but don't want to use expensive socket connections for everything (establishing new namespaces
 * for example).
 */
export abstract class SocketExpressServer<SocketAPI extends SocketInterface, HttpAPI extends HttpInterface> extends SocketServer<SocketAPI> {
	/**
	 * Default configuration values for all SocketExpressServers.
	 */
	public static DEFAULT_CONFIG: SocketExpressServerConfig<{}, {server:{}, client:{}}> =
		Object.assign({}, SocketServer.DEFAULT_CONFIG, ExpressServer.DEFAULT_CONFIG, {
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

	/**
	 * Defines how the server should react to HTTP requests.  Socket request handlers are inherited from SocketServer.
	 */
	protected httpHandlers: HttpHandlers<HttpAPI, ExpressHandlerCtx<HttpAPI>>;

	/**
	 * Constructs a new SocketExpressServer
	 */
	protected constructor(options?: SocketExpressServerConfig<HttpAPI, SocketAPI>) {
		super(options);
	}

	/**
	 * Override to allow the options object to be of type SocketExpressServerConfig.
	 */
	public configure(options: SocketExpressServerConfig<HttpAPI, SocketAPI>){
		super.configure(options);
		return this;
	}

	/**
	 * Sets up the the server as it would for a SocketServer, but adds in the ExpressServer functionality beforehand.
	 */
	public setup(httpServer: http.Server) {
		ExpressServer.prototype.setup.apply(this, httpServer);
		super.setup(httpServer);
	}

	/**
	 * Performs any necessary cleanup.
	 */
	public takedown() {
		ExpressServer.prototype.takedown.apply(this);
		super.takedown();
	}
}
