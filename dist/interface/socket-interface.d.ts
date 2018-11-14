/**
 * Where socket handlers can reside -- either on the server or the client.
 */
export declare type SocketLocation = 'server' | 'client';
/**
 * Given a SocketLocation, generates the opposite SocketLocation.
 */
export declare type OtherLocation<L extends SocketLocation> = L extends 'server' ? 'client' : 'server';
/**
 * Describes a transmittable event on either the client or the server.  Each one may specify its argument types with a
 * tuple, the name of the event it expects to receive as a response, and optionally the name of the event for which the
 * transmitter should be used as a response.  This can be confusing, but these guiding principles should clarify:
 *
 * * When you want the other side to respond to the transmitter with a particular event, use `expect`
 * * When you want the transmitter be used *as a response* to a particular event, use `responseTo`
 */
declare type EventTransmitter = {
    args: any[];
    expect?: string;
    responseTo?: string;
};
/**
 * Map structure that is meant to enumerate all possible transmittable events, along with the arguments that will be
 * passed with each.
 */
declare type TransmitterMap = {
    [event: string]: EventTransmitter;
};
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
declare type TransmitterWithResponseTo<T extends TransmitterMap, ResponseTo extends string> = Extract<{
    [K in keyof T]: T[K]['responseTo'] extends ResponseTo ? K : never;
}[keyof T], string>;
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
declare type ResponseTos<T extends TransmitterMap> = {
    [K in keyof T]: T[K]['responseTo'] extends string ? T[K]['responseTo'] : never;
}[keyof T];
/**
 * Describes all of the EventTransmitters within a server-client relationship.
 */
export declare type SocketInterface = {
    server: TransmitterMap;
    client: TransmitterMap;
};
/**
 * Utility type that generates a Response given a name and a TransmitterMap.
 */
export declare type Response<E extends string, T extends TransmitterMap, L extends SocketLocation> = {
    name: E;
    args: T[E]['args'];
} & (L extends 'server' ? {
    broadcast?: boolean;
} : {});
/**
 * Generic Response, given a TransmitterMap and a SocketLocation.
 */
declare type GenericTransmitterResponse<T extends TransmitterMap, L extends SocketLocation> = Response<Extract<keyof T, string>, T, L> | void;
/**
 * Specific Response based on what is expected from the given remote EventTransmitter.  (If nothing is expected,
 * it defaults to GenericTransmitterResponse.)
 */
declare type RemoteTransmitterResponse<RT extends EventTransmitter, T extends TransmitterMap, L extends SocketLocation> = RT['expect'] extends string ? Response<RT['expect'], T, L> : GenericTransmitterResponse<T, L>;
/**
 * A beautifully complex type that generates a collection of logically correct EventHandlers based on the remote
 * transmitters and local transmitters.  For example, if there exists a remote transmitter called 'request-data', then
 * there must exist a local event handler called 'request-data', and it must accept the arguments specified by that
 * remote transmitter.  Furthermore, if that remote transmitter expects a response from a local transmitter called
 * 'give-data', then the event handler must respond with that transmitter and the arguments specified by it.
 */
declare type EventHandlers<T extends TransmitterMap, RT extends TransmitterMap, L extends SocketLocation, CTX> = {
    [E in keyof RT]: (this: CTX, ...args: RT[E]['args']) => RemoteTransmitterResponse<RT[E], T, L>;
} & {
    [E in ResponseTos<T>]: (this: CTX, ...args: any[]) => Response<TransmitterWithResponseTo<T, E>, T, L>;
} & {
    [extraHandler: string]: (this: CTX, ...args: any[]) => GenericTransmitterResponse<T, L>;
};
/**
 * Utility type for generating EventHandlers given a SocketInterface and a SocketLocation.
 */
export declare type SocketHandlers<TS extends SocketInterface, SL extends SocketLocation, HandlerContext> = EventHandlers<TS[SL], TS[OtherLocation<SL>], SL, HandlerContext>;
export {};
