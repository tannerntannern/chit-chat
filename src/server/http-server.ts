import * as http from 'http';

/**
 * Defines how an HttpServer may be configured.
 */
export type HttpServerConfig = {
	host?: string,
	port?: number
};

/**
 * Defines how ServerManagers may be configured.
 */
export type ServerManagerConfig = {
	priority?: number
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
	protected serverManagers: {[key: string]: ServerManager} = {};

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
	 * Attaches a ServerManager(s) to this server.
	 */
	public attach(name: string, manager: ServerManager): this;
	public attach(managers: {[key: string]: ServerManager}): this;
	public attach(p1: string | {[key: string]: ServerManager}, p2?: ServerManager): this {
		// Force the overloads into a single case
		let managers: {[key: string]: ServerManager};
		if (typeof p1 === 'string') {
			managers = {};
			managers[p1] = p2;
		} else {
			managers = p1;
		}

		// Add the managers and assign their internal `peers` property
		for (let key in managers) {
			let manager = managers[key];
			// @ts-ignore: httpServer is protected and we want it to stay that way
			manager.httpServer = this;
			this.serverManagers[key] = manager;
		}

		return this;
	}

	/**
	 * Alias for attach(...)
	 */
	public with(name: string, manager: ServerManager): this;
	public with(managers: {[key: string]: ServerManager}): this;
	public with(p1: string | {[key: string]: ServerManager}, p2?: ServerManager): this {
		// @ts-ignore: since `with` is an alias, this is fine
		return this.attach(p1, p2);
	}

	/**
	 * Gets the keys of all the ServerManagers in order of priority.
	 */
	private getOrderedServerManagerKeys(): string[] {
		let m = this.serverManagers;
		return Object.keys(m).sort((a, b) => {
			// @ts-ignore: we don't want to expose config, but we still need to access it
			if (m[a].config.priority > m[b].config.priority) return -1;

			// @ts-ignore: we don't want to expose config, but we still need to access it
			else if (m[b].config.priority > m[a].config.priority) return 1;

			else return 0;
		});
	}

	/**
	 * Returns the ServerManager with the given name.
	 */
	public getManager(key: string): ServerManager {
		return this.serverManagers[key];
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

			for (let name of this.getOrderedServerManagerKeys())
				this.serverManagers[name].setup(this.httpServer);

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

				for (let name in this.serverManagers)
					this.serverManagers[name].takedown();

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
	 * Returns the default configuration for a ServerManager.
	 */
	protected static getDefaultConfig(): ServerManagerConfig {
		return {
			priority: 0
		};
	}

	/**
	 * Contains a reference to the HttpServer that this manager is attached to.  (only available after it has been
	 * attached)
	 */
	protected httpServer: HttpServer;

	/**
	 * Where configs specific to the ServerManager are stored.
	 */
	protected config;

	/**
	 * Constructs a new ServerManager and applies any additional configurations.
	 */
	constructor(options?: ServerManagerConfig) {
		this.config = (<typeof ServerManager> this.constructor).getDefaultConfig();
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
	 * Gets the HttpServer that this ServerManager is attached to.  (only available after it has been attached)
	 */
	public getServer(): HttpServer {
		return this.httpServer;
	}

	/**
	 * Since there can be multiple managers on an HttpServer, one manager may wish to communicate with another.  This
	 * function will return one of the other managers by name.
	 */
	public getPeer(name: string): ServerManager {
		return this.httpServer.getManager(name);
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