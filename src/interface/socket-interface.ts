/**
 * Where socket handlers can reside -- either on the server or the client.
 */
export type SocketLocation = 'server' | 'client';

/**
 * Given a SocketLocation, generates the opposite SocketLocation.
 */
export type OtherLocation<L extends SocketLocation> = L extends 'server' ? 'client' : 'server';

/**
 * Describes a transmittable event on either the client or the server.  Each one may specify its argument types with a
 * tuple, the name of the event it expects to receive as a response, and optionally the name of the event for which the
 * transmitter should be used as a response.  This can be confusing, but these guiding principles should clarify:
 *
 * * When you want the other side to respond to the transmitter with a particular event, use `expect`
 * * When you want the transmitter be used *as a response* to a particular event, use `responseTo`
 */
type EventTransmitter = {args: any[], expect?: string, responseTo?: string};

/**
 * Map structure that is meant to enumerate all possible transmittable events, along with the arguments that will be
 * passed with each.
 */
type TransmitterMap = {[event: string]: EventTransmitter};

/**
 * Given a TransmitterMap, this type be the union of names for any events that have the given ResponseTo type as their
 * `responseTo` value.  In a well-formed API, this should be a single string literal type.  To illustrate, since this
 * can be a confusing type:
 *
 * 	interface MyTransmitterMap {
 * 	    'notify-connected': {args: ..., responseTo: 'connect'}
 * 	}
 *
 * 	// This type will be equivalent to 'notify-connected'
 * 	type TransmitterOfInterest = TransmitterWithResponseTo<MyTransmitterMap, 'connect'>;
 */
type TransmitterWithResponseTo<T extends TransmitterMap, ResponseTo extends string> =
	Extract<{[K in keyof T]: T[K]['responseTo'] extends ResponseTo ? K : never}[keyof T], string>;

/**
 * Given a TransmitterMap, generates a type that is the union of all `responseTo` types within.  Based on:
 * https://github.com/Microsoft/TypeScript/issues/23199#issuecomment-379323872  To illustrate, since this can be a
 * confusing type:
 *
 * 	interface MyTransmitterMap {
 * 		'notify-disconnected': {args: ..., responseTo: 'disconnect'},
 * 	    'notify-connected': {args: ..., responseTo: 'connect'}
 * 	}
 *
 * 	// This type will be equivalent to 'connect' | 'disconnect'
 * 	type EventsOfInterest = ResponseTos<MyTransmitterMap>;
 */
type ResponseTos<T extends TransmitterMap> = {[K in keyof T]: T[K]['responseTo'] extends string ? T[K]['responseTo'] : never}[keyof T];

/**
 * Describes all of the EventTransmitters within a server-client relationship.
 */
export type SocketInterface = {
	server: TransmitterMap,
	client: TransmitterMap
};

/**
 * Utility type that generates a Response given a name and a TransmitterMap.
 */
export type Response<E extends string, T extends TransmitterMap, L extends SocketLocation> =
	{
		name: E, args: T[E]['args']							// Every Response must include the event name and arguments,
	} & (
		L extends 'server' ? { broadcast?: boolean } : {}	// but a server Response may also specify whether or not it is a broadcast.
	);

/**
 * Generic Response, given a TransmitterMap and a SocketLocation.
 */
type GenericTransmitterResponse<T extends TransmitterMap, L extends SocketLocation> =
	Response<Extract<keyof T, string>, T, L> | void;

/**
 * Specific Response based on what is expected from the given remote EventTransmitter.  (If nothing is expected,
 * it defaults to GenericTransmitterResponse.)
 */
type RemoteTransmitterResponse<RT extends EventTransmitter, T extends TransmitterMap, L extends SocketLocation> =
	// If the transmitter expects a specific response,
	RT['expect'] extends string ?
		// then make sure the handler returns it.
		Response<RT['expect'], T, L> :
		// Otherwise, the handler may return any Response available in Transmitters, or nothing at all.
		GenericTransmitterResponse<T, L>;

/**
 * A beautifully complex type that generates a collection of logically correct EventHandlers based on the remote
 * transmitters and local transmitters.  For example, if there exists a remote transmitter called 'request-data', then
 * there must exist a local event handler called 'request-data', and it must accept the arguments specified by that
 * remote transmitter.  Furthermore, if that remote transmitter expects a response from a local transmitter called
 * 'give-data', then the event handler must respond with that transmitter and the arguments specified by it.
 */
type EventHandlers<T extends TransmitterMap, RT extends TransmitterMap, L extends SocketLocation, CTX> = {
	// For every RemoteTransmitter, we expect a corresponding handler with the arguments specified by the RemoteTransmitter
	[E in keyof RT]: (this: CTX, ...args: RT[E]['args']) => RemoteTransmitterResponse<RT[E], T, L>;
} & {
	// For every Transmitter that has a `responseTo` field, we expect the corresponding handler
	[E in ResponseTos<T>]: (this: CTX, ...args: any[]) => Response<TransmitterWithResponseTo<T, E>, T, L>;
} & {
	// There may be any number of additional handlers that the server or client may wish to include that are not necessarily
	// the direct result of a message from the other.  These handlers may respond with an event response or nothing at all
	[extraHandler: string]: (this: CTX, ...args: any[]) => GenericTransmitterResponse<T, L>;
};

/**
 * Utility type for generating EventHandlers given a SocketInterface and a SocketLocation.
 */
export type SocketHandlers<TS extends SocketInterface, SL extends SocketLocation, HandlerContext> =
	EventHandlers<TS[SL], TS[OtherLocation<SL>], SL, HandlerContext>;
