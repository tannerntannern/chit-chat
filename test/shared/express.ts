import {HttpHandlers} from '../../src/interface/http-interface';
import {ExpressServer, HandlerCtx} from '../../src/server/express-server';
import {ExpressClient} from '../../src/client/express-client';

export interface API {
	get: {
		'/ping': {return: 'pong'},
		'/data': {return: string}
	},
	put: {
		'/data': {args: {value: string}, return: boolean}
	}
}

export class Server extends ExpressServer<API> {
	protected internalData: string = 'default';

	protected httpHandlers: HttpHandlers<API, HandlerCtx<API>> = {
		get: {
			'/ping': () => {
				return 'pong';
			},
			'/data': () => {
				return this.internalData;
			}
		},
		put: {
			'/data': (data) => {
				this.internalData = data.value;
				return true;
			}
		}
	};
}

export class Client extends ExpressClient<API> {}