declare type Endpoint = {
    return: any;
    args?: {
        [key: string]: any;
    };
};
/**
 * All supported HTTP methods.
 */
export declare type Methods = 'get' | 'delete' | 'post' | 'put' | 'patch';
/**
 * Defines the format for an HttpInterface; a collection of endpoints, grouped by method.
 */
export declare type HttpInterface = {
    [Mthd in Methods]?: {
        [route: string]: Endpoint;
    };
};
/**
 * Utility type for generating http handlers given an HttpInterface.
 */
export declare type HttpHandlers<API extends HttpInterface, HandlerCtx> = {
    [Mthd in keyof API]: {
        [EndPt in keyof API[Mthd]]: API[Mthd][EndPt]['args'] extends {
            [key: string]: any;
        } ? (this: HandlerCtx, data: API[Mthd][EndPt]['args']) => API[Mthd][EndPt]['return'] : (this: HandlerCtx) => API[Mthd][EndPt]['return'];
    };
} & {
    [Mthd in Methods]?: {
        [extraHandler: string]: (this: HandlerCtx, args?: {
            [key: string]: any;
        }) => any;
    };
};
export {};
