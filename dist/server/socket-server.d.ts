/// <reference types="node" />
import * as http from 'http';
import * as socketio from 'socket.io';
import { ServerManager, ServerManagerConfig } from './http-server';
import { SocketHandlers, SocketInterface } from '../interface/socket-interface';
import { SocketMixin } from '../lib/socket-mixin';
/**
 * Defines how SocketServer may be configured.
 */
export declare type SocketServerManagerConfig<API extends SocketInterface> = ServerManagerConfig & {
    ioOptions?: socketio.ServerOptions;
    namespaceConfig?: (namespace: socketio.Namespace, manager: SocketServerManager<API>) => void;
};
/**
 * Describes the shape of the `this` context that will be available in every SocketServer handler.
 */
export declare type HandlerCtx<API extends SocketInterface> = {
    manager: SocketServerManager<API>;
    socket: socketio.Socket;
    nsp: socketio.Namespace;
};
/**
 * A simple SocketServer with an API protected by TypeScript.
 */
declare abstract class SocketServerManager<API extends SocketInterface> extends ServerManager {
    /**
     * Returns the default configuration for a SocketServerManager.
     */
    protected static getDefaultConfig(): ServerManagerConfig;
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
     * Constructs a new SocketServerManager.
     */
    constructor(options?: SocketServerManagerConfig<API>);
    /**
     * Configures the SocketServerManager.
     */
    configure(options: SocketServerManagerConfig<API>): this;
    /**
     * Emits an event to the given target.  The typings ensure that only events defined in the API can be emitted.
     */
    emit<Event extends keyof API['server']>(target: socketio.Namespace | socketio.Socket, event: Event, ...args: API['server'][Event]['args']): this;
    /**
     * Handles a Response that requires a reply.
     */
    protected reply(ctx: HandlerCtx<API>, response: any): void;
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
    addNamespace(name: string): this;
    /**
     * Removes a namespace from the socket server.
     */
    removeNamespace(name: string): this;
    /**
     * Attaches a socket.io server to the internal Node http server.
     */
    setup(httpServer: http.Server): void;
    /**
     * Cleans up any socket-related junk.
     */
    takedown(): void;
}
interface SocketServerManager<API extends SocketInterface> extends SocketMixin<API, 'server'> {
}
export { SocketServerManager };
