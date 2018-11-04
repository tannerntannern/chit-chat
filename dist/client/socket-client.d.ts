import { SocketHandlers, SocketInterface } from '../interface/socket-interface';
/**
 * Describes the shape of the `this` context that will be available in every SocketClient handler.
 */
export declare type HandlerCtx<API extends SocketInterface> = {
    socket: SocketIOClient.Socket;
    client: SocketClient<API>;
};
/**
 * Basic socket client that can be used in Node or in the browser.
 */
export declare abstract class SocketClient<API extends SocketInterface> {
    /**
     * Socket.io Socket instance for internal use.
     */
    protected socket: SocketIOClient.Socket;
    /**
     * Contains implementations for the events described by the API.  This guarantees compatibility with any
     * SocketServer that implements the same API.
     */
    protected abstract socketHandlers: SocketHandlers<API, 'client', HandlerCtx<API>>;
    /**
     * Processes an incoming event with the appropriate socketHandler.  If the handler returns an EventResponse, the
     * proper event will automatically be emitted.
     */
    protected handleEvent(ctx: HandlerCtx<API>, event: string, ...args: any[]): void;
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
     * Attempts to connect to a SocketServer.  Returns a Promise for when the process completes or fails.
     */
    connect(url?: string, options?: SocketIOClient.ConnectOpts): Promise<any>;
    /**
     * Disconnects from the SocketServer, if there was a connection.
     */
    disconnect(): Promise<any>;
    /**
     * Emits an event to the connected SocketServer.  TypeScript ensures that the event adheres to the API description.
     */
    emit<Event extends keyof API['client']>(event: Event, ...args: API['client'][Event]['args']): void;
}
