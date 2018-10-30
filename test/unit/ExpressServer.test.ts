import 'mocha';
import {expect} from 'chai';
import {ExpressServer} from '../../src';
import {HttpHandlers} from '../../src/interface/http-interface';
import {HandlerCtx} from '../../src/server/express-server';

interface API {
	get: {
		'/ping': {return: 'pong'},
		'/data': {return: string}
	},
	put: {
		'/data': {args: {value: string}, return: boolean}
	}
}

class Server extends ExpressServer<API> {
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

describe('ExpressServer', function(){
	let s;
	beforeEach(() => {
		s = new Server();
	});

	// TODO: ...
});