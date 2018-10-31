/// <reference types="node" />
import * as http from 'http';
/**
 * Defines how an HttpServer may be configured.
 */
export declare type HttpServerConfig = {
    host?: string;
    port?: number;
};
/**
 * Defines the common interface and shared functionality that all Servers should have.
 */
export declare abstract class HttpServer {
    /**
     * Internal Node.js http server.
     */
    private httpServer;
    /**
     * Where the HttpServer configurations are stored.
     */
    protected config: any;
    /**
     * Constructs and configures a new HttpServer.
     */
    protected constructor(options?: HttpServerConfig);
    /**
     * Default configuration values for all HttpServers.
     */
    protected getDefaultConfig(): HttpServerConfig;
    /**
     * Returns whether or not the server is running.
     */
    isRunning(): boolean;
    /**
     * Applies configurations to the HttpServer.
     */
    configure<Config extends HttpServerConfig>(options: Config): this;
    /**
     * Configures the Node http server instance upon starting.
     */
    protected abstract setup(httpServer: http.Server): any;
    /**
     * Performs any necessary cleanup after the HttpServer stops listening.
     */
    protected abstract takedown(): any;
    /**
     * Starts the HttpServer and returns a Promise for when it's ready.
     */
    start(): Promise<boolean>;
    /**
     * Stops the HttpServer and returns a Promise for when it's done.
     */
    stop(): Promise<boolean>;
}
