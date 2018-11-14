import {SocketLocation, Response, SocketInterface} from '../interface/socket-interface';

/**
 * Mixin for shared socket functionality between the server and client.
 */
export abstract class SocketMixin<API extends SocketInterface, Loc extends SocketLocation> {
	/**
	 * @internal
	 */
	private waiters: {[event: string]: Function[]} = {};

	/**
	 * Expected by the mixin.
	 */
	protected abstract socketHandlers;

	/**
	 * Handles a Response that requires a reply.
	 */
	protected abstract reply(ctx, response: Response<string, API[Loc], Loc>);

	/**
	 * Processes an incoming event with the appropriate socketHandler.  If the handler returns an EventResponse, the
	 * proper event will automatically be emitted.
	 */
	protected handleEvent(ctx: unknown, event: string, ...args) {
		// Process the response if there is one
		let response = this.socketHandlers[event].call(ctx, ...args);
		if (response) this.reply(ctx, response);

		// Process any waiters
		let waiters = this.waiters[event];
		if (waiters) for (let waiter of waiters) waiter();
		this.waiters[event] = [];
	}

	/**
	 * Gives the ability to block and wait for an event.  Usage: `await this.blockEvent('some-event');`
	 */
	public blockEvent<Event extends string>(event: Event): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.waiters[<string>event])
				this.waiters[<string>event] = [];

			this.waiters[<string>event].push(resolve);
		});
	}
}
