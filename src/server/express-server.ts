import * as http from 'http';
import * as express from 'express';
import * as core from 'express-serve-static-core';
import * as bodyParser from 'body-parser';
import {ServerManager, ServerManagerConfig} from './http-server';
import {HttpHandlers, HttpInterface} from '../interface/http-interface';

/**
 * Defines how an ExpressServer may be configured.
 */
export type ExpressServerManagerConfig<API extends HttpInterface> = ServerManagerConfig & {
	expressConfig?: (expressApp: core.Express, server: ExpressServerManager<API>) => void,
	serveStaticDir?: string | null
};

/**
 * Describes the shape of the `this` context that will be available in every ExpressServer handler.
 */
export type HandlerCtx<API extends HttpInterface> = {
	req: express.Request,
	res: express.Response,
	manager: ExpressServerManager<API>
};

/**
 * A simple HTTP server built on Express, with an API protected by TypeScript.
 *
 * It should be noted that although this server is powered by Express, little effort is made to elegantly wrap around
 * the numerous features that Express provides.  The goal of this server is to provide basic bootstrapping for express
 * and to implement an interface that can also be implemented by an ExpressClient to ensure that both communicate with
 * each other properly.
 */
export abstract class ExpressServerManager<API extends HttpInterface> extends ServerManager {
	/**
	 * Returns the default configuration for an ExpressServerManager.
	 */
	protected static getDefaultConfig(): ServerManagerConfig {
		return Object.assign(super.getDefaultConfig(), {
			priority: 1,
			expressConfig: function(expressApp, manager) {
				expressApp.get('/', function(req, res){
					res.send(
						'<h1>It Works!</h1>' +
						'<p>The next step is to configure the server for your needs.</p>'
					);
				});
			},
			serveStaticDir: null
		});
	}

	/**
	 * Defines how the server should react to each request.
	 */
	protected abstract httpHandlers: HttpHandlers<API, HandlerCtx<API>>;

	/**
	 * Constructs a new ExpressServerManager.
	 */
	constructor(options?: ExpressServerManagerConfig<API>) {
		super(options);
	}

	/**
	 * Configures the ExpressServerManager.
	 */
	public configure(options: ExpressServerManagerConfig<API>): this {
		// @ts-ignore: ServerManager mixin
		super.configure(options);
		return this;
	}

	/**
	 * Configures an Express instance and attaches it to the given httpServer.
	 */
	public setup(httpServer: http.Server) {
		// Create express instance
		let app = express(),
			cfg = this.config;

		// Add middleware for parsing post requests
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		// Add user Express configurations
		cfg.expressConfig(app, this);

		// Init the handlers
		let that = this;
		for (let methodName in this.httpHandlers){
			let methodGroup = this.httpHandlers[methodName],
				argsKey = (methodName === 'put' || methodName === 'post' || methodName === 'patch') ? 'body' : 'query';

			for (let handlerName in methodGroup) {
				(<any>app)[methodName](handlerName, function(req, res) {
					let handler = methodGroup[handlerName],
						ctx: HandlerCtx<API> = { req: req, res: res, manager: that };

					let response = handler.call(ctx, req[argsKey]);

					res.send(response);
				});
			}
		}

		// Add config for serving a static directory
		if (cfg.serveStaticDir !== null)
			app.use(express.static(cfg.serveStaticDir));

		// Attach the express app to the httpServer
		httpServer.on('request', app);
	}

	/**
	 * Performs any necessary cleanup.
	 */
	public takedown(){
		// Nothing to clean up
	}
}
