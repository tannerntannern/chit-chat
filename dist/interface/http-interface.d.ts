import { ObjectOf } from '../lib/util';
/**
 * Describes the most basic kind of Endpoint.  Essentially just specifies a return type.
 */
declare type Endpoint = {
    return: any;
};
/**
 * Describes a slightly more complex kind of Endpoint, which has the ability to specify arguments.
 */
declare type EndpointWithArgs = Endpoint & {
    args?: object;
};
/**
 * Defines which HTTP methods don't accept extra arguments.
 */
export declare type MethodWithoutArgs = 'get' | 'delete' | 'head';
/**
 * Defines with HTTP methods do accept extra arguments.
 */
export declare type MethodWithArgs = 'post' | 'put' | 'patch';
/**
 * Defines the format for an HttpInterface.
 */
export declare type HttpInterface = {
    [Method in MethodWithArgs]?: ObjectOf<EndpointWithArgs>;
} & {
    [Method in MethodWithoutArgs]?: ObjectOf<Endpoint>;
};
/**
 * Utility type for generating http handlers given an HttpInterface.
 */
export declare type HttpHandlers<API extends HttpInterface, HandlerCtx> = {
    [Method in keyof API]: {
        [EP in keyof API[Method]]: API[Method] extends MethodWithoutArgs ? (this: HandlerCtx) => API[Method][EP]['return'] : (this: HandlerCtx, data: API[Method][EP]['args']) => API[Method][EP]['return'];
    };
};
export {};
