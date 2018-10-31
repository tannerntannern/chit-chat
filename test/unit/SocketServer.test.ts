import 'mocha';
import {expect} from 'chai';
import {SocketServer} from '../../src';
import {SocketHandlers} from '../../src/interface/socket-interface';
import {HandlerCtx} from '../../src/server/socket-server';

interface API {
	server: {
		'patch-data': {args: [string, string]}
	},
	client: {
		'get-data': {args: [string], expect: 'patch-data'},
		'put-data': {args: [string, string], expect: 'patch-data'}
	}
}

class Server extends SocketServer<API> {
	protected data = {};

	protected socketHandlers: SocketHandlers<API, "server", HandlerCtx<API>> = {
		'get-data': (key: string) => {
			return {
				name: 'patch-data',
				args: [key, this.data[key]]
			}
		},
		'put-data': (key: string, value: string) => {
			this.data[key] = value;
			return {
				name: 'patch-data',
				args: [key, value]
			}
		}
	};
}

describe('SocketServer', function(){
	// TODO: ...
});