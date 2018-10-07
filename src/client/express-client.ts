import axios from 'axios';
import {HttpInterface} from "../interface/http-interface";

/**
 * TODO
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
	 * TODO
	 */
	public post<EP extends keyof API['post']>(endpoint: EP, args: API['post'][EP]['args']): Promise<API['post'][EP]['return']> {
		return <Promise<API['post'][EP]['return']>> axios.post(this.host + endpoint, args);
	}
}
