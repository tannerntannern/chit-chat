import 'mocha';
import {expect} from 'chai';
import {Server, Client} from '../shared/socket';

describe('SocketServer + SocketClient', function(){
	let s, c1, c2;
	beforeEach(() => {
		s = new Server();
		c1 = new Client();
		c2 = new Client();
	});

	// TODO: ...
});