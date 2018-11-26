import { HttpInterface, Methods } from '../interface/http-interface';
import _axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
/**
 * Basic AJAX class than can be used in Node or the browser.  Essentially just wraps around some axios methods and
 * provides the proper typing based on the given HttpInterface, so that no requests are malformed.
 */
export declare class ExpressClient<API extends HttpInterface> {
    /**
     * Reference to the axios library.  If the client is running in the browser, it is assumed that axios will be
     * available on `window`.
     */
    static axios: typeof _axios;
    /**
     * The base hostname/URL that the client should send its requests to.
     */
    host: string;
    /**
     * Constructs a new ExpressClient.
     */
    constructor(host?: string);
    /**
     * General HTTP request method.
     */
    request<M extends Methods, EP extends keyof API[M]>(endpoint: EP, config: AxiosRequestConfig & {
        method: M;
        data?: API[M][EP]['args'];
    }): AxiosPromise<API[M][EP]['return']>;
    /**
     * Sends a GET request to the given endpoint.  Note that since GET requests cannot have a body, the args are passed
     * as query parameters.
     */
    get<EP extends keyof API['get']>(endpoint: EP, args: API['get'][EP]['args'], config?: AxiosRequestConfig): AxiosPromise<API['get'][EP]['return']>;
    /**
     * Sends a DELETE request to the given endpoint.  Note that since DELETE requests cannot have a body, the args are
     * passed as query parameters.
     */
    delete<EP extends keyof API['delete']>(endpoint: EP, args: API['delete'][EP]['args'], config?: AxiosRequestConfig): AxiosPromise<API['delete'][EP]['return']>;
    /**
     * Sends a POST request to the given endpoint with the given arguments.
     */
    post<EP extends keyof API['post']>(endpoint: EP, args: API['post'][EP]['args'], config?: AxiosRequestConfig): AxiosPromise<API['post'][EP]['return']>;
    /**
     * Sends a PUT request to the given endpoint with the given arguments.
     */
    put<EP extends keyof API['put']>(endpoint: EP, args: API['put'][EP]['args'], config?: AxiosRequestConfig): AxiosPromise<API['put'][EP]['return']>;
    /**
     * Sends a PATCH request to the given endpoint with the given arguments.
     */
    patch<EP extends keyof API['patch']>(endpoint: EP, args: API['patch'][EP]['args'], config?: AxiosRequestConfig): AxiosPromise<API['patch'][EP]['return']>;
}
