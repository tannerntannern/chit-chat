import { SocketHandlers, SocketInterface } from '../interface/socket-interface';
/**
 * TODO: ...
 */
declare type HandlerCtx = {};
/**
 * Basic socket client that can be used in Node or in the browser.
 */
export declare abstract class SocketClient<API extends SocketInterface> {
    /**
     * TODO: ...
     */
    protected io: SocketIOClient.Socket;
    /**
     * TODO: ...
     */
    protected abstract socketHandlers: SocketHandlers<API, 'client', HandlerCtx>;
    /**
     * TODO: ...
     */
    connect(url?: string, options?: SocketIOClient.ConnectOpts): Promise<boolean>;
    /**
     * TODO: ...
     */
    emit<Event extends keyof API['client']>(event: Event, ...args: API['client'][Event]['args']): void;
}
export {};
