import {HttpInterface, Methods} from '../interface/http-interface';
import _axios, {AxiosRequestConfig} from 'axios';

declare let window: any;

/**
 * Basic AJAX class than can be used in Node or the browser.  Essentially just wraps around some axios methods and
 * provides the proper typing based on the given HttpInterface, so that no requests are malformed.
 */
export class ExpressClient<API extends HttpInterface> {
	/**
	 * Reference to the axios library.  If the client is running in the browser, it is assumed that axios will be
	 * available on `window`.
	 */
	public static axios: typeof _axios = (typeof window !== 'undefined') && window.axios ? window.axios : null;

	/**
	 * The base hostname/URL that the client should send its requests to.
	 */
	public host: string;

	/**
	 * Constructs a new ExpressClient.
	 */
	constructor(host: string = ''){
		this.host = host;

		// Make sure we have a valid axios reference
		if (!ExpressClient.axios) throw new Error(
			'Axios reference not detected.  If you are running in the browser, be sure to include the axios ' +
			'library beforehand.  If you are running under Node.js, you must assign the ExpressClient.axios property ' +
			'manually before instantiating an ExpressClient.'
		);
	}

	/**
	 * General HTTP request method.
	 */
	public request<M extends Methods, EP extends keyof API[M]>(
		endpoint: EP,
		config: AxiosRequestConfig & { method: M, data?: API[M][EP]['args'] }
	): Promise<API[M][EP]['return']> {
		Object.assign(config, {
			url: this.host + endpoint
		});

		return ExpressClient.axios.request(config);
	}

	/**
	 * Sends a GET request to the given endpoint.  Note that since GET requests cannot have a body, the args are passed
	 * as query parameters.
	 */
	public get<EP extends keyof API['get']>(endpoint: EP, args: API['get'][EP]['args'], config?: AxiosRequestConfig): Promise<API['get'][EP]['return']> {
		if (config === undefined) config = {};
		config.params = args;

		return ExpressClient.axios.get(this.host + endpoint, config);
	}

	/**
	 * Sends a DELETE request to the given endpoint.  Note that since DELETE requests cannot have a body, the args are
	 * passed as query parameters.
	 */
	public delete<EP extends keyof API['delete']>(endpoint: EP, args: API['delete'][EP]['args'], config?: AxiosRequestConfig): Promise<API['delete'][EP]['return']> {
		if (config === undefined) config = {};
		config.params = args;

		return ExpressClient.axios.delete(this.host + endpoint, config);
	}

	/**
	 * Sends a POST request to the given endpoint with the given arguments.
	 */
	public post<EP extends keyof API['post']>(endpoint: EP, args: API['post'][EP]['args'], config?: AxiosRequestConfig): Promise<API['post'][EP]['return']> {
		return ExpressClient.axios.post(this.host + endpoint, args, config);
	}

	/**
	 * Sends a PUT request to the given endpoint with the given arguments.
	 */
	public put<EP extends keyof API['put']>(endpoint: EP, args: API['put'][EP]['args'], config?: AxiosRequestConfig): Promise<API['put'][EP]['return']> {
		return ExpressClient.axios.put(this.host + endpoint, args, config);
	}

	/**
	 * Sends a PATCH request to the given endpoint with the given arguments.
	 */
	public patch<EP extends keyof API['patch']>(endpoint: EP, args: API['patch'][EP]['args'], config?: AxiosRequestConfig): Promise<API['patch'][EP]['return']> {
		return ExpressClient.axios.patch(this.host + endpoint, args, config);
	}
}
