import {ObjectOf} from "../lib/util";

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
type MethodWithoutArgs = 'get' | 'delete' | 'head';

/**
 * Defines with HTTP methods do accept extra arguments.
 */
type MethodWithArgs = 'post' | 'put' | 'patch';

/**
 * Defines the format for an HttpInterface.
 */
export type HttpInterface =
	{[Method in MethodWithArgs]?: ObjectOf<EndpointWithArgs>} &
	{[Method in MethodWithoutArgs]?: ObjectOf<Endpoint>};
