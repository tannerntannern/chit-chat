import {SocketLocation, Response, SocketInterface} from '../interface/socket-interface';

/**
 * Mixin for shared socket functionality between the server and client.
 */
export abstract class SocketMixin<API extends SocketInterface, Loc extends SocketLocation> {
	/**
	 * @internal
	 */
	private waiters: {
		[event: string]: {
			[startTime: number]: {
				resolve: Function,
				reject: Function,
				timeoutId
			}
		}
	} = {};

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
		if (waiters) {
			for (let sTime in waiters) {
				clearTimeout(waiters[sTime].timeoutId);		// Prevent the timeout from being triggered
				waiters[sTime].resolve();					// Resolve the promise
			}
		}

		this.waiters[event] = {};
	}

	/**
	 * Gives the ability to block and wait for an event.  Usage: `await this.blockEvent('some-event');`
	 */
	public blockEvent<Event extends string>(event: Event, timeout: number = 5000): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.waiters[event]) this.waiters[event] = {};

			// For the case that the event never arrives, we must setup a timeout function to reject the promise
			let timestamp = Date.now();
			let timeoutId = setTimeout(() => {
				this.waiters[event][timestamp].reject();
				delete this.waiters[event][timestamp];
			}, timeout);

			// Push our resolve and promise functions into the waiters structure.  If all goes well, they will be
			// by handleEvent when the event arrives
			this.waiters[event][timestamp] = {resolve: resolve, reject: reject, timeoutId: timeoutId};
		});
	}
}
