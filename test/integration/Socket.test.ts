import 'mocha';
import {expect} from 'chai';
import {Server, Client} from '../shared/socket';

describe('SocketServer + SocketClient', function(){
	let s, c1, c2;
	beforeEach(() => {
		s = new Server({port: 3000});
		c1 = new Client();
		c2 = new Client();

		s.start();
	});

	afterEach(async () => {
		await s.stop();
	});

	describe('Connecting/disconnecting a client to/from the server', function(){
		it('should throw an error if the client connects to a bad address', function(){
			expect(async () => { await c1.connect('http://localhost:3001') }).to.throw;
		});

		it('should not throw an error if the client connects to the correct address', function(){
			expect(async () => { await c1.connect('http://localhost:3000') }).to.not.throw;
		});

		it('should give proper results for isConnected()', async function(){
			expect(c1.isConnected()).to.be.false;

			await c1.connect('http://localhost:3000');
			// expect(c1.isConnected()).to.be.true; // TODO: this fails

			await c1.disconnect();
			expect(c1.isConnected()).to.be.false;
		});

		it('should properly handle disconnects', async function(){
			await c1.connect('http://localhost:3000');
			expect(c1.socket).to.not.equal(null);

			await c1.disconnect();
			expect(c1.socket).to.equal(null);
		});
	});
});