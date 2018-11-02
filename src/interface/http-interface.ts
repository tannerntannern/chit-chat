import {ObjectOf} from '../lib/util';

/**
 * Describes the most basic kind of Endpoint.  Essentially just specifies a return type.
 */
type Endpoint = {return: any};

/**
 * Describes a slightly more complex kind of Endpoint, which has the ability to specify arguments.
 */
type EndpointWithArgs = Endpoint & {args?: object};

/**
 * Defines which HTTP methods don't accept extra arguments.
 */
export type MethodWithoutArgs = 'get' | 'delete' | 'head';

/**
 * Defines with HTTP methods do accept extra arguments.
 */
export type MethodWithArgs = 'post' | 'put' | 'patch';

/**
 * All supported HTTP methods.
 */
export type Method =  MethodWithArgs | MethodWithoutArgs;

/**
 * Defines the format for an HttpInterface.
 */
export type HttpInterface =
	{[Method in MethodWithArgs]?: ObjectOf<EndpointWithArgs>} &
	{[Method in MethodWithoutArgs]?: ObjectOf<Endpoint>};

/**
 * Utility type for generating http handlers given an HttpInterface.
 */
export type HttpHandlers<API extends HttpInterface, HandlerCtx> = {
	[Method in keyof API]: {
		[EP in keyof API[Method]]: API[Method] extends MethodWithoutArgs ?
			// @ts-ignore: Not sure why the compiler is complaining about this
			(this: HandlerCtx) => API[Method][EP]['return'] :
			// @ts-ignore: Not sure why the compiler is complaining about this
			(this: HandlerCtx, data: API[Method][EP]['args']) => API[Method][EP]['return'];
	}
} & {
	// Extra handlers not specified by the API
	[M in Method]?: {
		[extraHandler: string]: (this: HandlerCtx, data?: object) => any
	}
};
