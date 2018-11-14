/// <reference types="node" />
import * as http from 'http';
import * as socketio from 'socket.io';
import { HttpServer, HttpServerConfig } from './http-server';
import { SocketHandlers, SocketInterface } from '../interface/socket-interface';
import { SocketMixin } from '../lib/socket-mixin';
/**
 * Defines how SocketServer may be configured.
 */
export declare type SocketServerConfig<API extends SocketInterface> = {
    ioOptions?: socketio.ServerOptions;
    namespaceConfig?: (namespace: socketio.Namespace, server: SocketServer<API>) => void;
} & HttpServerConfig;
/**
 * Describes the shape of the `this` context that will be available in every SocketServer handler.
 */
export declare type HandlerCtx<API extends SocketInterface> = {
    server: SocketServer<API>;
    socket: socketio.Socket;
    nsp: socketio.Namespace;
};
/**
 * A simple SocketServer with an API protected by TypeScript.
 */
declare abstract class SocketServer<API extends SocketInterface> extends HttpServer {
    /**
     * Socket.io server instance for managing socket communication.
     */
    protected io: socketio.Server;
    /**
     * Contains implementations for the events described by the API.  This guarantees compatibility with any
     * SocketClient that implements the same API.
     */
    protected abstract socketHandlers: SocketHandlers<API, 'server', HandlerCtx<API>>;
    /**
     * Constructs a new SocketServer.
     */
    constructor(options?: SocketServerConfig<API>);
    /**
     * Default configuration values for all SocketServers.
     */
    getDefaultConfig(): HttpServerConfig;
    /**
     * Override to allow the options object to be of type SocketServerConfig.
     */
    configure(options: SocketServerConfig<API>): this;
    /**
     * Emits an event to the given target.  The typings ensure that only events defined in the API can be emitted.
     */
    emit<Event extends keyof API['server']>(target: socketio.Namespace | socketio.Socket, event: Event, ...args: API['server'][Event]['args']): void;
    /**
     * Handles a Response that requires a reply.
     */
    protected reply(ctx: any, response: any): void;
    /**
     * Sets up the socket handlers for the given namespace.
     */
    protected attachSocketHandlers(namespace: socketio.Namespace): void;
    /**
     * Returns a list of all the active namespaces on the socket server.
     */
    getNamespaces(): string[];
    /**
     * Adds a namespace to the socket server.  Throws an error if the namespace already exists.
     */
    addNamespace(name: string): void;
    /**
     * Removes a namespace from the socket server.
     */
    removeNamespace(name: string): void;
    /**
     * Attaches a socket.io server to the internal Node http server.
     */
    protected setup(httpServer: http.Server): void;
    /**
     * Cleans up any socket-related junk.
     */
    protected takedown(): void;
}
interface SocketServer<API extends SocketInterface> extends HttpServer, SocketMixin<API, 'server'> {
}
export { SocketServer };
