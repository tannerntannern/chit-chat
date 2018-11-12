/**
 * Where socket handlers can reside -- either on the server or the client.
 */
type SocketLocation = 'server' | 'client';

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

interface API {
	server: {
		'patch-data': {args: [string, string]},
		'reset-data': {args: [{}]},
		'connected': {args: [string], responseTo: 'connect'}
	},
	client: {
		'get-data': {args: [string], expect: 'patch-data'},
		'put-data': {args: [string, string], expect: 'patch-data'}
	}
}

type ResponseTos2<Transmitters extends TransmitterMap> = {
	[Key in keyof Transmitters]:
		Transmitters[Key]['responseTo'] extends string ?
			Transmitters[Key]['responseTo'] :
			never
}

let t: API['server'][keyof ResponseTos2<API['server']>]['responseTo'] = {
	'connected': 'connect'
};

/**
 * TODO
 */
export type ResponseTos<Transmitters extends TransmitterMap> = Transmitters['connected' | 'reset-data']['responseTo'];

/**
 * Describes all of the EventTransmitters within a server-client relationship.
 */
export type SocketInterface = {
	server: TransmitterMap,
	client: TransmitterMap
};

/**
 * Utility type that generates an EventResponse given a name and a TransmitterMap.
 */
export type EventResponse<E extends string, T extends TransmitterMap, L extends SocketLocation> =
	{
		name: E, args: T[E]['args']							// Every EventResponse must include the event name and arguments,
	} & (
		L extends 'server' ? { broadcast?: boolean } : {}	// but a server EventResponse may also specify whether or not it is a broadcast.
	);

/**
 * Generic EventResponse, given a TransmitterMap and a SocketLocation.
 */
type GenericTransmitterResponse<T extends TransmitterMap, L extends SocketLocation> =
	EventResponse<Extract<keyof T, string>, T, L> | void;

/**
 * Specific EventResponse based on what is expected from the given remote EventTransmitter.  (If nothing is expected,
 * it defaults to GenericTransmitterResponse.)
 */
type RestrictedRemoteTransmitterResponse<RT extends EventTransmitter, T extends TransmitterMap, L extends SocketLocation> =
	// If the transmitter expects a specific response,
	RT['expect'] extends string ?
		// then make sure the handler returns it.
		EventResponse<RT['expect'], T, L> :
		// Otherwise, the handler may return any EventResponse available in Transmitters, or nothing at all.
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
	[E in keyof RT]: (this: CTX, ...args: RT[E]['args']) => RestrictedRemoteTransmitterResponse<RT[E], T, L>;
} & {
	// For every Transmitter that has a `responseTo` field, we expect the corresponding handler
	// [Event in ResponseTos<T>]: (this: CTX, ...args: any[]) => GenericTransmitterResponse<T, L>; TODO: this needs rethinking; not correct
} & {
	// There may be any number of additional handlers that the server or client may wish to include that are not necessarily
	// the direct result of a message from the other.  These handlers may respond with an event response or nothing at all
	[extraHandler: string]: (this: CTX, ...args: any[]) => GenericTransmitterResponse<T, L>;
};

/**
 * Utility type for generating EventHandlers given a SocketInterface and a SocketLocation.
 */
export type SocketHandlers<TS extends SocketInterface, SL extends SocketLocation, HandlerContext> =
	SL extends 'server' ?
		EventHandlers<TS['server'], TS['client'], SL, HandlerContext> :
		EventHandlers<TS['client'], TS['server'], SL, HandlerContext>;
