import * as http from 'http';

/**
 * Defines how an HttpServer may be configured.
 */
export type HttpServerConfig = {
	host?: string,
	port?: number
};

/**
 * Defines the common interface and shared functionality that all Servers should have.
 */
export abstract class HttpServer {
	/**
	 * Internal Node.js http server.
	 */
	private httpServer: http.Server = null;

	/**
	 * Where the HttpServer configurations are stored.
	 */
	protected config;

	/**
	 * Constructs and configures a new HttpServer.
	 */
	protected constructor(options?: HttpServerConfig) {
		// Apply default configurations
		this.config = this.getDefaultConfig();

		// Then apply configurations given to constructor
		this.configure(options);
	}

	/**
	 * Default configuration values for all HttpServers.
	 */
	protected getDefaultConfig(): HttpServerConfig {
		return {
			host: 'localhost',
			port: 3000
		};
	}

	/**
	 * Returns whether or not the server is running.
	 */
	public isRunning(): boolean {
		return this.httpServer && this.httpServer.address() !== null;
	}

	/**
	 * Applies configurations to the HttpServer.
	 */
	public configure<Config extends HttpServerConfig>(options: Config): this {
		if (this.isRunning()) throw new Error('Cannot make configuration changes while the server is running!');

		Object.assign(this.config, options);

		return this;
	}

	/**
	 * Configures the Node http server instance upon starting.
	 */
	protected abstract setup(httpServer: http.Server);

	/**
	 * Performs any necessary cleanup after the HttpServer stops listening.
	 */
	protected abstract takedown();

	/**
	 * Starts the HttpServer and returns a Promise for when it's ready.
	 */
	public start(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.httpServer = http.createServer();

			this.setup(this.httpServer);

			this.httpServer.listen(this.config.port, () => {
				resolve(true);
			});
		});
	}

	/**
	 * Stops the HttpServer and returns a Promise for when it's done.
	 */
	public stop(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.httpServer.close(() => {
				this.httpServer = null;

				this.takedown();

				resolve(true);
			});
		});
	}
}