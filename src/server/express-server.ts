import * as express from 'express';
import * as core from 'express-serve-static-core';
import * as bodyParser from 'body-parser';
import {AbstractServer, AbstractServerConfig} from './abstract-server';
import {HttpInterface, MethodWithoutArgs} from '../interface/http-interface';

/**
 * Defines how an ExpressServer may be configured.
 */
export type ExpressServerConfig<API extends HttpInterface> = {
	expressConfig?: (expressApp: core.Express, server: ExpressServer<API>) => void,
	serveStaticDir?: string | null
} & AbstractServerConfig;

/**
 * The shape of the context that will be available in every ExpressServer handler.
 */
type HandlerCtx<API extends HttpInterface> = {req: any, res: any, server: ExpressServer<API>};

/**
 * A simple HTTP API server, built on Express.
 *
 * It should be noted that although this server is powered by Express, little effort is made to elegantly wrap around
 * the numerous features that Express provides.  The goal of this server is to provide basic bootstrapping for express
 * and to implement an interface that can also be implemented by an ExpressClient to ensure that both communicate with
 * each other properly.
 */
export abstract class ExpressServer<API extends HttpInterface> extends AbstractServer {
	/**
	 * Default configuration values for all ExpressServers.
	 */
	protected static DEFAULT_CONFIG: ExpressServerConfig<{}> = Object.assign(AbstractServer.DEFAULT_CONFIG, {
		expressConfig: function(expressApp, server) {
			expressApp.get('/', function(req, res){
				res.send(
					'<h1>It Works!</h1>' +
					'<p>The next step is to configure the server for your needs.</p>'
				);
			});
		},
		serveStaticDir: null
	});

	/**
	 * Express instance for handling standard HTTP requests.
	 */
	protected expressApp: core.Express = null;

	/**
	 * Http server that underlies Express.
	 */
	protected httpServer = null;

	/**
	 * Defines how the server should react to each request.
	 */
	protected httpHandlers: {
		[Method in keyof API]: {
			[EP in keyof API[Method]]: API[Method] extends MethodWithoutArgs ?
				// @ts-ignore: Not sure why the compiler is complaining about this
				(this: HandlerCtx) => API[Method][EP]['return'] :
				// @ts-ignore: Not sure why the compiler is complaining about this
				(this: HandlerCtx, data: API[Method][EP]['args']) => API[Method][EP]['return'];
		}
	};

	/**
	 * Constructs a new ExpressServer.
	 */
	constructor(options?: ExpressServerConfig<API>) {
		super(options);
	}

	/**
	 * Override to allow the options object to be of type ExpressServerConfig.
	 */
	public configure(options: ExpressServerConfig<API>): this {
		super.configure(options);
		return this;
	}

	/**
	 * Starts the ExpressServer.
	 */
	public start(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			// Create express instance
			this.expressApp = express();
			let app = this.expressApp,
				cfg = this.config;

			// Add middleware for parsing post requests
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({ extended: true }));

			// Add user Express configurations
			cfg.expressConfig(app, this);

			// Init the handlers
			let that = this;
			for (let methodName in this.httpHandlers){
				let methodGroup = this.httpHandlers[methodName];
				for (let handlerName in methodGroup) {
					(<any>app)[methodName](handlerName, function(req, res, next) {
						let handler = methodGroup[handlerName],
							ctx: HandlerCtx<API> = { req: req, res: res, server: that };

						let response = handler.call(ctx, req.body);

						res.send(response);
					});
				}
			}

			// Add config for serving a static directory
			if (cfg.serveStaticDir !== null)
				app.use(express.static(cfg.serveStaticDir));

			// Start listening
			this.httpServer = app.listen(cfg.port, () => {
				this.running = true;
				resolve(true);
			});
		});
	}

	/**
	 * Stops the ExpressServer.
	 */
	public stop(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.httpServer.close(() => {
				this.running = false;
				this.expressApp = null;
				this.httpServer = null;
				resolve(true);
			});
		});
	}
}
