import { SocketLocation, Response, SocketInterface } from '../interface/socket-interface';
/**
 * Mixin for shared socket functionality between the server and client.
 */
export declare abstract class SocketMixin<API extends SocketInterface, Loc extends SocketLocation> {
    /**
     * @internal
     */
    private waiters;
    /**
     * Expected by the mixin.
     */
    protected abstract socketHandlers: any;
    /**
     * Handles a Response that requires a reply.
     */
    protected abstract reply(ctx: any, response: Response<string, API[Loc], Loc>): any;
    /**
     * Processes an incoming event with the appropriate socketHandler.  If the handler returns an EventResponse, the
     * proper event will automatically be emitted.
     */
    protected handleEvent(ctx: unknown, event: string, ...args: any[]): void;
    /**
     * Gives the ability to block and wait for an event.  Usage: `await this.blockEvent('some-event');`
     */
    blockEvent<Event extends string>(event: Event): Promise<any>;
}
