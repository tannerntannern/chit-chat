import {SocketClient, SocketServerManager} from '../../src';
import {SocketHandlers} from '../../src/interface/socket-interface';
import {HandlerCtx as ServerCtx} from '../../src/server/socket-server';
import {HandlerCtx as ClientCtx} from '../../src/client/socket-client';
import * as socketio from 'socket.io-client';

SocketClient.io = socketio;

export interface API {
	server: {
		'patch-data': {args: [string, string]},
		'reset-data': {args: [{}]},
		'connected': {args: [string], responseTo: 'connect'},
		'your-nsp-is': {args: [string]}
	},
	client: {
		'what-is-my-nsp': {args: [], expect: 'your-nsp-is'},
		'get-data': {args: [string], expect: 'patch-data'},
		'put-data': {args: [string, string], expect: 'patch-data'}
	}
}

export class ServerManager extends SocketServerManager<API> {
	protected data = {};

	protected socketHandlers: SocketHandlers<API, 'server', ServerCtx<API>> = {
		'connect': function () {
			return {
				name: 'connected',
				args: [this.socket.id]
			};
		},
		'what-is-my-nsp': function() {
			return {
				name: 'your-nsp-is',
				args: [this.nsp.name]
			}
		},
		'get-data': (key: string) => {
			return {
				name: 'patch-data',
				args: [key, this.data[key]]
			};
		},
		'put-data': (key: string, value: string) => {
			this.data[key] = value;
			return {
				name: 'patch-data',
				args: [key, value],
				broadcast: true
			};
		}
	};
}

export class Client extends SocketClient<API> {
	protected data = {};
	protected myNsp: string = null;

	protected socketHandlers: SocketHandlers<API, 'client', ClientCtx<API>> = {
		'connected': (id: string) => {
			// console.log(id, 'has connected!');
		},
		'your-nsp-is': (nsp: string) => {
			this.myNsp = nsp;
		},
		'patch-data': (key: string, value: string) => {
			this.data[key] = value;
		},
		'reset-data': (data: {}) => {
			this.data = data;
		}
	};
}