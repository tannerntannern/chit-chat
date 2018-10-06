import * as express from 'express';
import * as bodyParser from 'body-parser';
import {AbstractServer, AbstractServerConfig} from "./abstract-server";
import {HttpInterface} from "../http-interface";

/**
 * Defines how an ExpressServer may be configured.
 */
export type ExpressServerConfig = {
	expressConfig?: (expressApp, server) => void,
	serveStaticDir?: string | null
} & AbstractServerConfig;

/**
 * A simple AbstractServer-compatible ExpressServer.
 */
export abstract class ExpressServer<Interface extends HttpInterface> extends AbstractServer {
	/**
	 * Default configuration values for all ExpressServers.
	 */
	protected static DEFAULT_CONFIG: ExpressServerConfig = Object.assign(AbstractServer.DEFAULT_CONFIG, {
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
	protected expressApp = null;

	/**
	 * Http server that underlies Express.
	 */
	protected httpServer = null;

	/**
	 * TODO...
	 */
	protected handlers: {
		[Method in keyof Interface]: {
			[EP in keyof Interface[Method]]: (...args: Interface[Method][EP]['args']) => Interface[Method][EP]['return']
		}
	};

	/**
	 * Constructs a new ExpressServer.
	 */
	constructor(options?: ExpressServerConfig) {
		super(options);

		// Init the handlers
		let that = this, app = this.expressApp;
		for (let methodName in this.handlers){
			let methodGroup = this.handlers[methodName];
			for (let handlerName in methodGroup) {
				app[methodName](handlerName, function(req, res, next) {
					let handler = methodGroup[handlerName],
						ctx = { req: req, res: res, server: that };

					let response = handler.call(ctx, req.body);

					res.send(response);
				});
			}
		}
	}

	/**
	 * Override to allow the options object to be of type ExpressServerConfig.
	 */
	public configure(options: ExpressServerConfig): this {
		super.configure(options);
		return this;
	}

	/**
	 * Starts the ExpressServer.
	 */
	public start(): Promise<boolean> {
		// Create express instance
		this.expressApp = express();
		let that = this,
			app = this.expressApp,
			cfg = this.config;

		// Add default callback if not defined
		if (_.isUndefined(callback))
			callback = function () {
				console.info(that.getName() + ' listening on port ' + cfg.port);
			};

		// Add middleware for parsing post requests
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		// Add user Express configurations
		cfg.expressConfig(app, this);

		// Add httpInterfaces to expressApp
		this.initHttpInterfaces();

		// Add config for serving a static directory
		if (cfg.serveStaticDir !== null)
			app.use(express.static(cfg.serveStaticDir));

		// Start listening
		this.httpServer = app.listen(cfg.port, function () {
			that.running = true;
			callback();
		});
	}

	/**
	 * Stops the ExpressServer.
	 */
	public stop(): Promise<boolean> {
		let that = this;

		// Add default callback if not defined
		if (_.isUndefined(callback))
			callback = function() {
				console.info('Stopped ' + that.getName() + ' on port ' + that.config.port);
			};

		// Stop listening
		that.httpServer.close(function(){
			that.running = false;
			that.expressApp = null;
			that.httpServer = null;
			callback();
		});
	}
}