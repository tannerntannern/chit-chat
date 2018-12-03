import 'mocha';
import {expect} from 'chai';
import {ServerManager, Client} from '../shared/socket';
import {HttpServer} from '../../src';

describe('SocketServer + SocketClient', function(){
	let s, m, c;
	beforeEach(async () => {
		s = new HttpServer({port: 3000}).with('socket', new ServerManager());
		m = s.getManager('socket');
		c = new Client();

		await s.start();
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

		it('should be able to connect to other namespaces', async function(){
			m.addNamespace('TEST');

			await c.connect('http://localhost:3000/TEST', 'connected');

			c.emit('what-is-my-nsp');
			await c.blockEvent('your-nsp-is');

			expect(c.myNsp).to.equal('/TEST');

			c.disconnect();
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
		it('should timeout if blockEvent() never recieves the event', async function(){
			await c.connect('http://localhost:3000', 'connected');

			expect(async () => { await c.blockEvent('asdf', 500) }).to.throw;

			c.disconnect();
		});

		it('should be able to accept changes from the server', async function(){
			await c.connect('http://localhost:3000', 'connected');

			m.emit(m.io.nsps['/'], 'reset-data', {newKey: 'new value'});
			await c.blockEvent('reset-data');

			expect(c.data).to.deep.equal({newKey: 'new value'});

			c.disconnect();
		});

		it('should be able to put data on the server', async function(){
			await c.connect('http://localhost:3000', 'connected');

			c.emit('put-data', 'keyFromClient', 'valueFromClient');
			await m.blockEvent('put-data');
			expect(m.data.keyFromClient).to.equal('valueFromClient');

			await c.blockEvent('patch-data');
			expect(c.data.keyFromClient).to.equal('valueFromClient');

			c.disconnect();
		});

		it('should be able to get data from the server', async function(){
			await c.connect('http://localhost:3000', 'connected');

			m.data = {keyFromServer: 'valueFromServer'};
			c.emit('get-data', 'keyFromServer');

			await c.blockEvent('patch-data');
			expect(c.data.keyFromServer).to.equal('valueFromServer');

			c.disconnect();
		});
	});
});