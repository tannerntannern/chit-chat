import {ObjectOf} from "./util";

/**
 * Defines what an HttpRequestHandler function should look like.  Basically, every handler will take a request, do
 * something on the server, then return something to be sent back by res.send().
 */
export type HttpRequestHandler = (params?: object) => any;

/**
 * Defines what an HttpInterface should look like, which is essentially a bunch of HttpRequestHandlers grouped by HTTP
 * request methods.
 */
export type HttpInterface = {
	get?: ObjectOf<HttpRequestHandler>,
	post?: ObjectOf<HttpRequestHandler>,
	put?: ObjectOf<HttpRequestHandler>,
	head?: ObjectOf<HttpRequestHandler>,
	delete?: ObjectOf<HttpRequestHandler>,
	patch?: ObjectOf<HttpRequestHandler>,
	options?: ObjectOf<HttpRequestHandler>
};

/**
 * Encapsulates the functionality of a class that can use HttpInterfaces.
 */
export abstract class HttpInterfaceMixin {
	/**
	 * The class we are mixing into must have an expressApp property
	 */
	protected abstract expressApp;

	/**
	 * Collection of HttpInterfaces.  The format of this can be further specified with other interfaces.
	 */
	httpInterfaces: ObjectOf<HttpInterface>;

	/**
	 * Initializes all the handlers specified in httpInterfaces.
	 */
	protected initHttpInterfaces() {
		let that = this, app = this.expressApp;

		for(let intfceName in this.httpInterfaces){
			let intfce = this.httpInterfaces[intfceName];
			for(let methodName in intfce){
				let methodGroup = intfce[methodName];
				for(let handlerName in methodGroup) {
					app[methodName](handlerName, function(req, res, next) {
						let handler = methodGroup[handlerName],
							ctx = { req: req, res: res, server: that };

						let response = handler.call(ctx, req.body);

						res.send(response);
					});
				}
			}
		}
	}
}