import 'mocha';
import {expect} from 'chai';
import {Server} from '../shared/socket';

describe('SocketServer', function(){
	let s, m;
	beforeEach(() => {
		let {server, manager} = Server.makeServer();
		s = server;
		m = manager;
	});

	describe('Configuration', function(){
		it('should have the proper default configurations', function(){
			expect(m.config.ioOptions).to.deep.equal({});
		});
	});

	describe('Namespaces', function(){
		beforeEach(async () => {
			await s.start();
		});

		afterEach(async () => {
			await s.stop();
		});

		it('There should only be one namespace by default', function(){
			expect(m.getNamespaces()).to.deep.equal(['/']);
		});

		it('should properly add namespaces', function(){
			m.addNamespace('test');
			expect(m.getNamespaces()).to.deep.equal(['/', '/test']);
		});

		it('should properly remove namespaces', function(){
			m.addNamespace('test1');
			m.addNamespace('test2');
			expect(m.getNamespaces()).to.deep.equal(['/', '/test1', '/test2']);

			m.removeNamespace('test1');
			expect(m.getNamespaces()).to.deep.equal(['/', '/test2']);
		});
	});

	// TODO: ...
});