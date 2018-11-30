/// <reference types="node" />
import * as http from 'http';
import * as express from 'express';
import * as core from 'express-serve-static-core';
import { ServerManager, ServerManagerConfig } from './http-server';
import { HttpHandlers, HttpInterface } from '../interface/http-interface';
/**
 * Defines how an ExpressServer may be configured.
 */
export declare type ExpressServerManagerConfig<API extends HttpInterface> = ServerManagerConfig & {
    expressConfig?: (expressApp: core.Express, server: ExpressServerManager<API>) => void;
    serveStaticDir?: string | null;
};
/**
 * Describes the shape of the `this` context that will be available in every ExpressServer handler.
 */
export declare type HandlerCtx<API extends HttpInterface> = {
    req: express.Request;
    res: express.Response;
    manager: ExpressServerManager<API>;
};
/**
 * A simple HTTP server built on Express, with an API protected by TypeScript.
 *
 * It should be noted that although this server is powered by Express, little effort is made to elegantly wrap around
 * the numerous features that Express provides.  The goal of this server is to provide basic bootstrapping for express
 * and to implement an interface that can also be implemented by an ExpressClient to ensure that both communicate with
 * each other properly.
 */
export declare abstract class ExpressServerManager<API extends HttpInterface> extends ServerManager {
    /**
     * Returns the default configuration for an ExpressServerManager.
     */
    protected static getDefaultConfig(): ServerManagerConfig;
    /**
     * Defines how the server should react to each request.
     */
    protected abstract httpHandlers: HttpHandlers<API, HandlerCtx<API>>;
    /**
     * Constructs a new ExpressServerManager.
     */
    constructor(options?: ExpressServerManagerConfig<API>);
    /**
     * Configures the ExpressServerManager.
     */
    configure(options: ExpressServerManagerConfig<API>): this;
    /**
     * Configures an Express instance and attaches it to the given httpServer.
     */
    setup(httpServer: http.Server): void;
    /**
     * Performs any necessary cleanup.
     */
    takedown(): void;
}
