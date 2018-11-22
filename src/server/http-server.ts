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
export class HttpServer {
	/**
	 * Internal Node.js http server.
	 */
	private httpServer: http.Server = null;

	/**
	 * List of ServerManagers in charge of the server.
	 */
	protected serverManagers: ServerManager[] = [];

	/**
	 * Where the HttpServer configurations are stored.
	 */
	protected config: HttpServerConfig = {
		host: 'localhost',
		port: 3000
	};

	/**
	 * Constructs and configures a new HttpServer.
	 */
	constructor(options?: HttpServerConfig) {
		this.configure(options);
	}

	/**
	 * Attaches a ServerManager to this server.
	 */
	public attach(...managers: ServerManager[]) {
		this.serverManagers.push(...managers);
	}

	/**
	 * Returns whether or not the server is running.
	 */
	public isRunning(): boolean {
		return this.httpServer !== null && this.httpServer.address() !== null;
	}

	/**
	 * Applies configurations to the HttpServer.
	 */
	public configure(options: HttpServerConfig): this {
		if (this.isRunning()) throw new Error('Cannot make configuration changes while the server is running!');

		Object.assign(this.config, options);

		return this;
	}

	/**
	 * Starts the HttpServer and returns a Promise for when it's ready.
	 */
	public start(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.httpServer = http.createServer();

			for (let manager of this.serverManagers)
				manager.setup(this.httpServer);

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

				for (let manager of this.serverManagers)
					manager.takedown();

				resolve(true);
			});
		});
	}
}

/**
 * A special class that can be attached to HttpServers to manage them; the "management" part must be implemented.
 */
export abstract class ServerManager {
	/**
	 * Convenience method that constructs a new HttpServer with a ServerManager attached to it.
	 */
	public static makeServer(serverConfig?: HttpServerConfig, managerConfig?: unknown): {server: HttpServer, manager: ServerManager} {
		// @ts-ignore: instantiating abstract class
		let manager = new this(managerConfig),
			server = new HttpServer(serverConfig);

		server.attach(manager);

		return {
			server: server,
			manager: manager
		};
	}

	/**
	 * Where configs specific to the ServerManager are stored.
	 */
	protected config = {};

	/**
	 * Constructs a new ServerManager and applies any additional configurations.
	 */
	constructor(options?: unknown) {
		this.configure(options);
	}

	/**
	 * Modifies the internal config object.
	 */
	public configure(options): this {
		Object.assign(this.config, options);
		return this;
	}

	/**
	 * Configures the Node http server instance upon starting.
	 */
	public abstract setup(httpServer: http.Server);

	/**
	 * Performs any necessary cleanup after the HttpServer stops listening.
	 */
	public abstract takedown();
}