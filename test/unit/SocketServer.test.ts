import 'mocha';
import {expect} from 'chai';
import {Server} from '../shared/socket';

describe('SocketServer', function(){
	let s;
	beforeEach(() => {
		s = new Server();
	});

	describe('Configuration', function(){
		it('should have the proper default configurations', function(){
			expect(s.config.ioOptions).to.deep.equal({});
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
			expect(s.getNamespaces()).to.deep.equal(['/']);
		});

		it('should properly add namespaces', function(){
			s.addNamespace('test');
			expect(s.getNamespaces()).to.deep.equal(['/', '/test']);
		});

		it('should properly remove namespaces', function(){
			s.addNamespace('test1');
			s.addNamespace('test2');
			expect(s.getNamespaces()).to.deep.equal(['/', '/test1', '/test2']);

			s.removeNamespace('test1');
			expect(s.getNamespaces()).to.deep.equal(['/', '/test2']);
		});
	});

	// TODO: ...
});