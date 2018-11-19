/**
 * Describes the components of an endpoint.
 */
import {HandlerCtx} from '../server/express-server';

type Endpoint = {return: any, args?: {[key: string]: any}};

/**
 * All supported HTTP methods.
 */
export type Methods =  'get' | 'delete' | 'post' | 'put' | 'patch';

/**
 * Defines the format for an HttpInterface; a collection of endpoints, grouped by method.
 */
export type HttpInterface = {
	[Mthd in Methods]?: {
		[route: string]: Endpoint
	}
};

/**
 * Utility type for generating http handlers given an HttpInterface.
 */
export type HttpHandlers<API extends HttpInterface, HandlerCtx> = {
	[Mthd in keyof API]: {
		// @ts-ignore: not sure why TypeScript is complaining about this
		[EndPt in keyof API[Mthd]]: API[Mthd][EndPt]['args'] extends {[key: string]: any} ?
			// @ts-ignore: not sure why TypeScript is complaining about this
			(this: HandlerCtx, data: API[Mthd][EndPt]['args']) => API[Mthd][EndPt]['return'] :
			// @ts-ignore: not sure why TypeScript is complaining about this
			(this: HandlerCtx) => API[Mthd][EndPt]['return'];
	}
} & {
	// Extra handlers not specified by the API
	[Mthd in Methods]?: {
		[extraHandler: string]: (this: HandlerCtx, args?: {[key: string]: any}) => any
	}
};

/**
 * TODO: ...
 */
export interface ExpressServerInterface<API extends HttpInterface> {
	httpHandlers: HttpHandlers<API, HandlerCtx<API>>;
}
