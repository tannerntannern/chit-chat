import axios from 'axios';
import {HttpInterface, MethodWithArgs, MethodWithoutArgs} from "../interface/http-interface";

/**
 * Basic AJAX class than can be used in Node or the browser.  Essentially just wraps around some axios methods and
 * provides the proper typing based on the given HttpInterface, so that no requests are malformed.
 */
export class ExpressClient<API extends HttpInterface> {
	/**
	 * The base hostname/URL that the client should send its requests to.
	 */
	public host: string;

	/**
	 * Constructs a new ExpressClient.
	 */
	constructor(host: string){
		this.host = host;
	}

	/**
	 * General HTTP request method.
	 */
	public request<M extends MethodWithoutArgs, EP extends keyof API[M]>(method: M, endpoint: EP): Promise<API[M][EP]['return']>;
	public request<M extends MethodWithArgs, EP extends keyof API[M]>(method: M, endpoint: EP, args: API[M][EP]['args']): Promise<API[M][EP]['return']>;
	public request<M extends MethodWithoutArgs, EP extends keyof API[M]>(method, endpoint, args?): Promise<API[M][EP]['return']> {
		let config: any = {
			method: method,
			url: this.host + endpoint
		};

		if (args !== undefined) config.data = args;

		return axios.request(config);
	}

	/**
	 * Sends a GET request to the given endpoint.
	 */
	public get<EP extends keyof API['get']>(endpoint: EP): Promise<API['get'][EP]['return']> {
		return axios.get(this.host + endpoint);
	}

	/**
	 * Sends a DELETE request to the given endpoint.
	 */
	public delete<EP extends keyof API['delete']>(endpoint: EP): Promise<API['delete'][EP]['return']> {
		return axios.delete(this.host + endpoint);
	}

	/**
	 * Sends a HEAD request to the given endpoint.
	 */
	public head<EP extends keyof API['head']>(endpoint: EP): Promise<API['head'][EP]['return']> {
		return axios.head(this.host + endpoint);
	}

	/**
	 * Sends a POST request to the given endpoint with the given arguments.
	 */
	public post<EP extends keyof API['post']>(endpoint: EP, args: API['post'][EP]['args']): Promise<API['post'][EP]['return']> {
		return axios.post(this.host + endpoint, args);
	}

	/**
	 * Sends a PUT request to the given endpoint with the given arguments.
	 */
	public put<EP extends keyof API['put']>(endpoint: EP, args: API['put'][EP]['args']): Promise<API['put'][EP]['return']> {
		return axios.put(this.host + endpoint, args);
	}

	/**
	 * Sends a PATCH request to the given endpoint with the given arguments.
	 */
	public patch<EP extends keyof API['patch']>(endpoint: EP, args: API['patch'][EP]['args']): Promise<API['patch'][EP]['return']> {
		return axios.patch(this.host + endpoint, args);
	}
}
