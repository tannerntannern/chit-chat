import 'mocha';
import {expect} from 'chai';
import {SocketServer} from '../../src';
import {SocketHandlers} from '../../src/interface/socket-interface';
import {HandlerCtx} from '../../src/server/socket-server';

interface API {
	server: {

	},
	client: {

	}
}

class Server extends SocketServer<API> {
	protected socketHandlers: SocketHandlers<API, "server", HandlerCtx<API>>;

}

describe('SocketServer', function(){
	// TODO: ...
});