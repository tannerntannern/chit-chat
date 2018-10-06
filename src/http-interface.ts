import {ObjectOf} from "./util";

/**
 * TODO
 */
type Endpoint = {args: any[], return: any};

/**
 * TODO
 */
export type HttpInterface = {
	get?: ObjectOf<Endpoint>,
	post?: ObjectOf<Endpoint>,
	put?: ObjectOf<Endpoint>,
	head?: ObjectOf<Endpoint>,
	delete?: ObjectOf<Endpoint>,
	patch?: ObjectOf<Endpoint>,
	options?: ObjectOf<Endpoint>
};
