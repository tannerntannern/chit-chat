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
export declare class HttpServer {
    /**
     * Internal Node.js http server.
     */
    private httpServer;
    /**
     * List of ServerManagers in charge of the server.
     */
    protected serverManagers: {
        [key: string]: ServerManager;
    };
    /**
     * Where the HttpServer configurations are stored.
     */
    protected config: HttpServerConfig;
    /**
     * Constructs and configures a new HttpServer.
     */
    constructor(options?: HttpServerConfig);
    /**
     * Attaches a ServerManager(s) to this server.
     */
    attach(name: string, manager: ServerManager): this;
    attach(managers: {
        [key: string]: ServerManager;
    }): this;
    /**
     * Alias for attach(...)
     */
    with(name: string, manager: ServerManager): this;
    with(managers: {
        [key: string]: ServerManager;
    }): this;
    /**
     * Returns the ServerManager with the given name.
     */
    getManager(key: string): ServerManager;
    /**
     * Returns whether or not the server is running.
     */
    isRunning(): boolean;
    /**
     * Applies configurations to the HttpServer.
     */
    configure(options: HttpServerConfig): this;
    /**
     * Starts the HttpServer and returns a Promise for when it's ready.
     */
    start(): Promise<boolean>;
    /**
     * Stops the HttpServer and returns a Promise for when it's done.
     */
    stop(): Promise<boolean>;
}
/**
 * A special class that can be attached to HttpServers to manage them; the "management" part must be implemented.
 */
export declare abstract class ServerManager {
    /**
     * Contains a reference to the other ServerManagers on the HttpServer that this manager is attached to.  (only
     * available after it has been attached)
     */
    private peers;
    /**
     * Where configs specific to the ServerManager are stored.
     */
    protected config: {};
    /**
     * Constructs a new ServerManager and applies any additional configurations.
     */
    constructor(options?: unknown);
    /**
     * Modifies the internal config object.
     */
    configure(options: any): this;
    /**
     * Since there can be multiple managers on an HttpServer, one manager may wish to communicate with another.  This
     * function will return one of the other managers by name.
     */
    getPeer(name: string): ServerManager;
    /**
     * Configures the Node http server instance upon starting.
     */
    abstract setup(httpServer: http.Server): any;
    /**
     * Performs any necessary cleanup after the HttpServer stops listening.
     */
    abstract takedown(): any;
}
