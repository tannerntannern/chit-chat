import { SocketHandlers, SocketInterface } from '../interface/socket-interface';
import { SocketMixin } from '../lib/socket-mixin';
import { Socket, ConnectOpts } from '../lib/types';
import * as _io from 'socket.io-client';
/**
 * Describes the shape of the `this` context that will be available in every SocketClient handler.
 */
export declare type HandlerCtx<API extends SocketInterface> = {
    socket: Socket;
    client: SocketClient<API>;
};
/**
 * Basic socket client that can be used in Node or in the browser.
 */
export declare abstract class SocketClient<API extends SocketInterface> extends SocketMixin<API, 'client'> {
    /**
     * Reference to the socket.io-client library.  If the client is running in the browser, it is assumed that `io` will
     * be available on `window`.
     */
    static io: typeof _io;
    /**
     * Socket.io Socket instance for internal use.
     */
    protected socket: Socket;
    /**
     * Contains implementations for the events described by the API.  This guarantees compatibility with any
     * SocketServer that implements the same API.
     */
    protected abstract socketHandlers: SocketHandlers<API, 'client', HandlerCtx<API>>;
    /**
     * Constructs a new SocketClient.
     */
    constructor();
    /**
     * Sets up the socket handlers for the client.
     */
    protected attachSocketHandlers(): void;
    /**
     * Returns whether or not the client has an active socket connection.
     */
    isConnected(): boolean;
    /**
     * Returns the socket id if the client is connected.
     */
    getSocketId(): string;
    /**
     * Attempts to connect to a SocketServer.
     */
    connect<WaitFor extends string | null>(url?: string, waitFor?: WaitFor, options?: ConnectOpts): WaitFor extends string ? Promise<any> : void;
    /**
     * Disconnects from the SocketServer, if there was a connection.
     */
    disconnect(): void;
    /**
     * Emits an event to the connected SocketServer.  TypeScript ensures that the event adheres to the API description.
     */
    emit<Event extends keyof API['client']>(event: Event, ...args: API['client'][Event]['args']): void;
    /**
     * Handles a Response that requires a reply.
     */
    protected reply(ctx: any, response: any): void;
}
