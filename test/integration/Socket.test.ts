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
			expect(async () => { await c.connect('http://localhost:3001') }).to.throw;
		});

		it('should not throw an error if the client connects to the correct address', function(){
			expect(async () => { await c.connect('http://localhost:3000') }).to.not.throw;
		});

		it('should give proper results for isConnected()', async function(){
			expect(c.isConnected()).to.be.false;

			await c.connect('http://localhost:3000/');
			// expect(c.isConnected()).to.be.true;

			await c.disconnect();
			expect(c.isConnected()).to.be.false;
		});

		it('should properly handle disconnects', async function(){
			await c.connect('http://localhost:3000');
			expect(c.socket).to.not.equal(null);

			await c.disconnect();
			expect(c.socket).to.equal(null);
		});
	});

	// describe('Transmitting and receiving data', function(){
	// 	it('should be able to accept changes from the server', async function(){
	// 		await c.connect('http://localhost:3000');
	//
	// 		console.log('sending event...');
	// 		s.emit(s.io.nsps['/'], 'reset-data', {newKey: 'new value'});
	// 		console.log('awaiting event...');
	// 		await c.blockEvent('reset-data');
	// 		console.log('received event...');
	//
	// 		await c.disconnect();
	// 	});
	// });
});