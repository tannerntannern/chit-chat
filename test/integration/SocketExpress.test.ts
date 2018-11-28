import 'mocha';
import {expect} from 'chai';
import {ServerManager as ExpressServerManager, Client as ExpressClient} from '../shared/express';
import {ServerManager as SocketServerManager} from '../shared/socket';
import {HttpServer} from '../../src';

describe('SocketServerManager + ExpressServerManager + HttpServer', function(){
	let s, sm, em, ec;
	beforeEach(() => {
		s = new HttpServer().with({
			socket: new SocketServerManager(),
			express: new ExpressServerManager()
		});
		sm = s.getManager('socket');
		em = s.getManager('express');

		ec = new ExpressClient('http://localhost:3000');
	});

	describe('Using both managers on the same server', function(){
		it('should start properly', async function(){
			await s.start();

			expect(s.isRunning()).to.be.true;

			await s.stop();
		});

		it('should be able to process the default GET / request without errors', async function(){
			await s.start();

			expect(async () => {await ec.get('/')}).to.not.throw;

			await s.stop();
		});
	});
});