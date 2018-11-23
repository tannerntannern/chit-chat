import 'mocha';
import {expect} from 'chai';
import * as http from 'http';
import {HttpServer, ServerManager} from '../../src/server/http-server';

let setupCalls = 0, takedownCalls = 0;
class Manager extends ServerManager {
	public setup(httpServer: http.Server) {
		setupCalls ++;
	}

	public takedown() {
		takedownCalls ++;
	}
}

describe('HttpServer', function(){
	let s, m;
	beforeEach(() => {
		s = new HttpServer().with('manager', new Manager());
		m = s.getManager('manager');
	});

	describe('Configuration', function(){
		it('should have the proper default configuration values', function(){
			expect(s.config.port).to.equal(3000);
			expect(s.config.host).to.equal('localhost');
		});

		it('should accept new configuration values via the config() method', function(){
			s.configure({port: 2000, host: 'my.domain.com'});

			expect(s.config.port).to.equal(2000);
			expect(s.config.host).to.equal('my.domain.com');
		});

		it('should throw an error if configuration is attempted while running', async function(){
			await s.start();

			expect(() => { s.configure({port: 4000}) }).to.throw();

			await s.stop();
		});
	});

	describe('Starting', function(){
		afterEach(async () => {
			await s.stop();
		});

		it('should have an internal httpServer value of null prior to starting', async function(){
			expect(s.httpServer).to.equal(null);
			await s.start();
			expect(s.httpServer).to.not.equal(null);
		});

		it('should report proper isRunning() values before and after starting', async function(){
			expect(s.isRunning()).to.be.false;
			await s.start();
			expect(s.isRunning()).to.be.true;
		});

		it('should call setup() upon starting', async function(){
			let expectedCalls = setupCalls + 1;
			await s.start();
			expect(setupCalls).to.equal(expectedCalls);
		});
	});

	describe('Stopping', function(){
		beforeEach(async () => {
			await s.start();
		});
		
		it('should have an internal httpServer value of null after stopping', async function(){
			expect(s.httpServer).to.not.equal(null);
			await s.stop();
			expect(s.httpServer).to.equal(null);
		});

		it('should report proper isRunning() values before and after stopping', async function(){
			expect(s.isRunning()).to.be.true;
			await s.stop();
			expect(s.isRunning()).to.be.false;
		});

		it('should call takedown() upon stopping', async function(){
			let expectedCalls = takedownCalls + 1;
			await s.stop();
			expect(takedownCalls).to.equal(expectedCalls);
		});
	});
});