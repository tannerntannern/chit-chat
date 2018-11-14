import 'mocha';
import {expect} from 'chai';
import {Server, Client} from '../shared/socket';

describe('SocketServer + SocketClient', function(){
	let s, c;
	beforeEach(() => {
		s = new Server({port: 3000});
		c = new Client();

		s.start();
	});

	afterEach(async () => {
		await s.stop();
	});

	describe('Connecting/disconnecting a client to/from the server', function(){
		it('should throw an error if the client connects to a bad address', function(){
			expect(async () => { await c.connect('http://localhost:3001', 'connected') }).to.throw;
		});

		it('should not throw an error if the client connects to the correct address', function(){
			expect(async () => { await c.connect('http://localhost:3000', 'connected') }).to.not.throw;
		});

		it('should give proper results for isConnected()', async function(){
			expect(c.isConnected()).to.be.false;

			await c.connect('http://localhost:3000', 'connected');
			expect(c.isConnected()).to.be.true;

			c.disconnect('disconnected');
			expect(c.isConnected()).to.be.false;
		});

		it('should properly handle disconnects', async function(){
			await c.connect('http://localhost:3000', 'connected');
			expect(c.socket).to.not.equal(null);

			c.disconnect();
			expect(c.socket).to.equal(null);
		});
	});

	describe('Transmitting and receiving data', function(){
		it('should be able to accept changes from the server', async function(){
			await c.connect('http://localhost:3000', 'connected');

			s.emit(s.io.nsps['/'], 'reset-data', {newKey: 'new value'});
			await c.blockEvent('reset-data');

			expect(c.data).to.deep.equal({newKey: 'new value'});

			await c.disconnect();
		});

		// TODO: ...
	});
});