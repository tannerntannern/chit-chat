import 'mocha';
import {expect} from 'chai';
import {ServerManager as ExpressServerManager, Client as ExpressClient} from '../shared/express';
import {ServerManager as SocketServerManager, Client as SocketClient} from '../shared/socket';
import {HttpServer} from '../../src';

describe('SocketServerManager + ExpressServerManager + HttpServer', function(){
	let s, sm, em, ec, sc;
	beforeEach(() => {
		s = new HttpServer().with({
			socket: new SocketServerManager({}),
			express: new ExpressServerManager()
		});
		sm = s.getManager('socket');
		em = s.getManager('express');

		ec = new ExpressClient('http://localhost:3000');
		sc = new SocketClient();
	});

	describe('Using both managers on the same server', function(){
		it('should start properly', async function(){
			await s.start();

			expect(s.isRunning()).to.be.true;

			await s.stop();
		});

		it('should be able to open socket connections without errors', async function(){
			await s.start();

			expect(async () => await sc.connect('http://localhost:3000', 'connected')).to.not.throw;
			sc.disconnect();

			await s.stop();
		});
	});
});