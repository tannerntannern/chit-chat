import { AxiosRequestConfig } from 'axios';
import { HttpInterface, MethodWithArgs, MethodWithoutArgs } from '../interface/http-interface';
/**
 * Basic AJAX class than can be used in Node or the browser.  Essentially just wraps around some axios methods and
 * provides the proper typing based on the given HttpInterface, so that no requests are malformed.
 */
export declare class ExpressClient<API extends HttpInterface> {
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
    request<M extends MethodWithArgs | MethodWithoutArgs, EP extends keyof API[M]>(endpoint: EP, config: AxiosRequestConfig & {
        method: M;
        data?: M extends MethodWithArgs ? API[M][EP]['args'] : any;
    }): Promise<API[M][EP]['return']>;
    /**
     * Sends a GET request to the given endpoint.
     */
    get<EP extends keyof API['get']>(endpoint: EP, config?: AxiosRequestConfig): Promise<API['get'][EP]['return']>;
    /**
     * Sends a DELETE request to the given endpoint.
     */
    delete<EP extends keyof API['delete']>(endpoint: EP, config?: AxiosRequestConfig): Promise<API['delete'][EP]['return']>;
    /**
     * Sends a HEAD request to the given endpoint.
     */
    head<EP extends keyof API['head']>(endpoint: EP, config?: AxiosRequestConfig): Promise<API['head'][EP]['return']>;
    /**
     * Sends a POST request to the given endpoint with the given arguments.
     */
    post<EP extends keyof API['post']>(endpoint: EP, args: API['post'][EP]['args'], config?: AxiosRequestConfig): Promise<API['post'][EP]['return']>;
    /**
     * Sends a PUT request to the given endpoint with the given arguments.
     */
    put<EP extends keyof API['put']>(endpoint: EP, args: API['put'][EP]['args'], config?: AxiosRequestConfig): Promise<API['put'][EP]['return']>;
    /**
     * Sends a PATCH request to the given endpoint with the given arguments.
     */
    patch<EP extends keyof API['patch']>(endpoint: EP, args: API['patch'][EP]['args'], config?: AxiosRequestConfig): Promise<API['patch'][EP]['return']>;
}
