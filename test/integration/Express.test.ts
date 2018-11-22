import 'mocha';
import {expect} from 'chai';
import {Server, Client} from '../shared/express';

describe('ExpressServer + ExpressClient', function(){
	let s, m, c;
	beforeEach(async () => {
		let {server, manager} = Server.makeServer();
		s = server;
		m = manager;
		c = new Client('http://localhost:3000');

		m.users = [{name: 'Bob', age: 60}, {name: 'Shirley', age: 47}];

		await s.start();
	});

	afterEach(async () => {
		await s.stop();
	});

	describe('Using an API', function(){
		it('should be able to use the generic request method', async function(){
			// We will just test GET /users for this test
			let users = await c.request('/users', {method: 'get'});
			expect(users.data).to.deep.equal([{name: 'Bob', age: 60}, {name: 'Shirley', age: 47}]);
		});

		it('should be able to GET all users', async function(){
			let users = await c.get('/users', {});
			expect(users.data).to.deep.equal([{name: 'Bob', age: 60}, {name: 'Shirley', age: 47}]);
		});

		it('should be able to GET a specific user', async function(){
			let user = await c.get('/user', {id: 0});
			expect(user.data).to.deep.equal({name: 'Bob', age: 60});
		});

		it('should be able to POST a new user', async function(){
			await c.post('/user', {name: 'Josh', age: 30});
			expect(m.users[2]).to.deep.equal({name: 'Josh', age: 30});
		});

		it('should be able to PUT a user', async function(){
			await c.put('/user', {index: 1, user: {name: 'Bill', age: 65}});
			expect(m.users[1]).to.deep.equal({name: 'Bill', age: 65});
		});

		it('should be able to PATCH an existing user', async function(){
			expect(m.users[0].age).to.equal(60);

			await c.patch('/user', {index: 0, userKey: 'age', userValue: 61});

			expect(m.users[0].age).to.equal(61);
		});

		it('should be able to DELETE an existing user', async function(){
			await c.delete('/user', {index: 0});
			expect(m.users).to.deep.equal([{name: 'Shirley', age: 47}]);
		});
	});
});