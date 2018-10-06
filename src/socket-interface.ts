/**
 * Where socket events can reside -- either on the server, or on the client.
 */
type SocketLocation = 'server' | 'client';

/**
 * Options for ServerSocketInterface types.  'global' applies to events on the global namespace, whereas 'namespaced'
 * applies to events on a specific namespace.
 */
type ServerSocketInterfaceType = 'global' | 'namespaced';

/**
 * Describes an EventTransmitter by specifying what arguments can be passed along with it, and optionally which
 * transmitter is expected to be triggered after the other side receives this particular transmission.  For example,
 * a 'request-data' transmitter might look like this: `{args: [DataSchema], expect: 'give-data'}`
 */
type EventTransmitter = {args: any[], expect?: string};

/**
 * Map structure that is meant to enumerate all possible transmittable events, along with the arguments that will be
 * passed with each.
 */
type TransmitterMap = {[event: string]: EventTransmitter};

/**
 * Describes all of the EventTransmitters within a server-client relationship.
 */
type TransmitterStructure = {
	server: TransmitterMap,
	client: TransmitterMap
};

/**
 * Utility type that generates an EventResponse given an EventTransmitter name and a TransmitterMap.
 */
type EventResponse<Name extends string, Transmitters extends TransmitterMap, Location extends SocketLocation> =
	{
		name: Name, args?: Transmitters[Name]['args']				// Every EventResponse must include the event name and arguments,
	} & (
		Location extends 'server' ? { broadcast?: boolean } : {}	// but a server EventResponse may also specify whether or not it is a broadcast.
	);

/**
 * A beautifully complex type that generates a collection of logically correct EventHandlers based on the remote
 * transmitters and local transmitters.  For example, if there exists a remote transmitter called 'request-data', then
 * there must exist a local event handler called 'request-data', and it must accept the arguments specified by that
 * remote transmitter.  Furthermore, if that remote transmitter expects a response from a local transmitter called
 * 'give-data', then the event handler must respond with that transmitter and the arguments specified by it.
 */
type EventHandlers<Transmitters extends TransmitterMap, RemoteTransmitters extends TransmitterMap, Location extends SocketLocation, HandlerContext> = {
	// For every RemoteTransmitter, we expect a corresponding handler with the arguments specified by the RemoteTransmitter
	[RT in keyof RemoteTransmitters]: (this: HandlerContext, ...args: RemoteTransmitters[RT]['args']) =>
		// If the transmitter expects a specific response,
		RemoteTransmitters[RT]['expect'] extends string ?
			// then make sure the handler returns it.
			EventResponse<RemoteTransmitters[RT]['expect'], Transmitters, Location> :
			// Otherwise, the handler may return any EventResponse available in Transmitters, or nothing at all.
			EventResponse<Extract<keyof Transmitters, string>, Transmitters, Location> | void;
};

/**
 * Utility type for generating EventHandlers given a TransmitterStructure and a SocketLocation.
 */
type SocketInterface<TS extends TransmitterStructure, SL extends SocketLocation, HandlerContext> =
	SL extends 'server' ?
		EventHandlers<TS['server'], TS['client'], SL, HandlerContext> :
		EventHandlers<TS['client'], TS['server'], SL, HandlerContext>;

/**
 * Given a TransmitterStructure and an interface type ('global' or 'namespaced'), describes the shape of the
 * EventHandlers for a socket server.
 */
export interface ServerSocketInterface<TS extends TransmitterStructure, Type extends ServerSocketInterfaceType, HandlerContext> {
	eventHandlers: Type extends 'global' ?
		{global: SocketInterface<TS, 'server', HandlerContext>} :
		{namespaced: SocketInterface<TS, 'server', HandlerContext>};
}

/**
 * Given a TransmitterStructure, describes the shape of the EventHandlers for a socket client.
 */
export interface ClientSocketInterface<TS extends TransmitterStructure, HandlerContext> {
	eventHandlers: SocketInterface<TS, 'client', HandlerContext>
}
