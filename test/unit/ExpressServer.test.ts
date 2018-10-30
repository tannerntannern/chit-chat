import 'mocha';
import {expect} from 'chai';
import * as path from 'path';
import axios from 'axios';
import {ExpressServer} from '../../src';
import {HttpHandlers} from '../../src/interface/http-interface';
import {HandlerCtx} from '../../src/server/express-server';

interface API {
	get: {
		'/ping': {return: 'pong'},
		'/data': {return: string}
	},
	put: {
		'/data': {args: {value: string}, return: boolean}
	}
}

class Server extends ExpressServer<API> {
	protected internalData: string = 'default';

	protected httpHandlers: HttpHandlers<API, HandlerCtx<API>> = {
		get: {
			'/ping': () => {
				return 'pong';
			},
			'/data': () => {
				return this.internalData;
			}
		},
		put: {
			'/data': (data) => {
				this.internalData = data.value;
				return true;
			}
		}
	};
}

describe('ExpressServer', function(){
	let s;
	beforeEach(() => {
		s = new Server();
	});

	describe('Configuration', function(){
		it('should have the proper default configurations', async function(){
			expect(s.config.serveStaticDir).to.equal(null);

			await s.start();
			expect((await axios.get('http://localhost:3000/')).data).to.equal(
				'<h1>It Works!</h1>' +
				'<p>The next step is to configure the server for your needs.</p>'
			);

			await s.stop();
		});

		it('should properly serve a static directory', async function(){
			s.configure({
				expressConfig: () => null,
				serveStaticDir: path.resolve('./test/unit/serve')
			});

			await s.start();
			expect((await axios.get('http://localhost:3000/test.html')).data).to.equal(
				'<h1>Hello there</h1>'
			);

			await s.stop();
		});
	});

	describe('Using an API', function(){
		beforeEach(async () => {
			await s.start();
		});

		afterEach(async () => {
			await s.stop();
		});

		it('should pass a basic ping-pong test', async function(){
			expect((await axios.get('http://localhost:3000/ping')).data).to.equal('pong');
		});

		it('should be able to use PUT /data and GET /data to modify and view data on the server', async function(){
			expect(s.internalData).to.equal('default');
			expect((await axios.get('http://localhost:3000/data')).data).to.equal('default');

			await axios.put('http://localhost:3000/data', {value: 'test-data'});

			expect(s.internalData).to.equal('test-data');
			expect((await axios.get('http://localhost:3000/data')).data).to.equal('test-data');
		});
	});
});