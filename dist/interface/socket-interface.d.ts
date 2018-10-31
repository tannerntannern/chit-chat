/**
 * Where socket events can reside -- either on the server, or on the client.
 */
declare type SocketLocation = 'server' | 'client';
/**
 * Describes an EventTransmitter by specifying what arguments can be passed along with it, and optionally which
 * transmitter is expected to be triggered after the other side receives this particular transmission.  For example,
 * a 'request-data' transmitter might look like this: `{args: [DataSchema], expect: 'give-data'}`
 */
declare type EventTransmitter = {
    args: any[];
    expect?: string;
};
/**
 * Map structure that is meant to enumerate all possible transmittable events, along with the arguments that will be
 * passed with each.
 */
declare type TransmitterMap = {
    [event: string]: EventTransmitter;
};
/**
 * Describes all of the EventTransmitters within a server-client relationship.
 */
export declare type SocketInterface = {
    server: TransmitterMap;
    client: TransmitterMap;
};
/**
 * Utility type that generates an EventResponse given an EventTransmitter name and a TransmitterMap.
 */
export declare type EventResponse<Name extends string, Transmitters extends TransmitterMap, Location extends SocketLocation> = {
    name: Name;
    args: Transmitters[Name]['args'];
} & (Location extends 'server' ? {
    broadcast?: boolean;
} : {});
/**
 * A beautifully complex type that generates a collection of logically correct EventHandlers based on the remote
 * transmitters and local transmitters.  For example, if there exists a remote transmitter called 'request-data', then
 * there must exist a local event handler called 'request-data', and it must accept the arguments specified by that
 * remote transmitter.  Furthermore, if that remote transmitter expects a response from a local transmitter called
 * 'give-data', then the event handler must respond with that transmitter and the arguments specified by it.
 */
declare type EventHandlers<Transmitters extends TransmitterMap, RemoteTransmitters extends TransmitterMap, Location extends SocketLocation, HandlerContext> = {
    [RT in keyof RemoteTransmitters]: (this: HandlerContext, ...args: RemoteTransmitters[RT]['args']) => RemoteTransmitters[RT]['expect'] extends string ? EventResponse<RemoteTransmitters[RT]['expect'], Transmitters, Location> : EventResponse<Extract<keyof Transmitters, string>, Transmitters, Location> | void;
};
/**
 * Utility type for generating EventHandlers given a SocketInterface and a SocketLocation.
 */
export declare type SocketHandlers<TS extends SocketInterface, SL extends SocketLocation, HandlerContext> = SL extends 'server' ? EventHandlers<TS['server'], TS['client'], SL, HandlerContext> : EventHandlers<TS['client'], TS['server'], SL, HandlerContext>;
export {};
