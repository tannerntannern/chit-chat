import {ObjectOf} from "../lib/util";

/**
 * TODO
 */
type Endpoint = {args: any[], return: any};

/**
 * TODO
 */
export type HttpInterface = {
	get?: ObjectOf<Endpoint>,
	delete?: ObjectOf<Endpoint>,
	head?: ObjectOf<Endpoint>,
	post?: ObjectOf<Endpoint>,
	put?: ObjectOf<Endpoint>,
	patch?: ObjectOf<Endpoint>
};
