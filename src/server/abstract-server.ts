/**
 * Defines how an AbstractServer may be configured.
 */
export type AbstractServerConfig = {
	host?: string,
	port?: number
};

/**
 * Defines the common interface and shared functionality that all Servers should have.
 */
export abstract class AbstractServer {
	/**
	 * Default configuration values for all AbstractServers.
	 */
	protected static DEFAULT_CONFIG: AbstractServerConfig = {
		host: 'localhost',
		port: 3000
	};

	/**
	 * For keeping track of whether or not the server is running.
	 */
	protected running: boolean = false;

	/**
	 * Where the AbstractServer configurations are stored.
	 */
	protected config;

	/**
	 * Constructs and configures a new AbstractServer.
	 */
	constructor(options?: AbstractServerConfig) {
		// Apply default configurations
		this.configure((<typeof AbstractServer>this.constructor).DEFAULT_CONFIG);

		// Then apply configurations given to constructor
		this.configure(options);
	}

	/**
	 * Applies configurations to the AbstractServer.
	 */
	public configure(options: AbstractServerConfig): this {
		if (this.running) throw new Error('Cannot make configuration changes while the server is running!');

		if (this.config === undefined) this.config = {};
		Object.assign(this.config, options);

		return this;
	}

	/**
	 * Returns whether or not the server is running.
	 */
	public isRunning(): boolean {
		return this.running;
	}

	/**
	 * Starts the AbstractServer and returns a Promise for when it's ready.
	 */
	public abstract start(): Promise<boolean>;

	/**
	 * Stops the AbstractServer and returns a Promise for when it's done.
	 */
	public abstract stop(): Promise<boolean>;
}