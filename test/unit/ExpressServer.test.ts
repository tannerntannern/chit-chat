import 'mocha';
import {expect} from 'chai';
import * as path from 'path';
import axios from 'axios';
import {Server} from '../shared/express';

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
});