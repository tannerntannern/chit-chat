import {HttpHandlers, HttpInterface} from '../../src/interface/http-interface';
import {ExpressServer, HandlerCtx} from '../../src/server/express-server';
import {ExpressClient} from '../../src/client/express-client';

export type User = {
	name: string,
	age: number
}

export interface API extends HttpInterface {
	get: {
		'/users': {args: {}, return: User[]},
		'/user': {args: {id: number}, return: User}
	},
	post: {
		'/user': {args: User, return: boolean}
	},
	put: {
		'/user': {args: {index: number, user: User}, return: boolean}
	},
	patch: {
		'/user': {args: {index: number, userKey: string, userValue: any}, return: boolean}
	},
	delete: {
		'/user': {args: {index: number}, return: boolean}
	}
}

export class Server extends ExpressServer<API> {
	protected users: User[];

	protected httpHandlers: HttpHandlers<API, HandlerCtx<API>> = {
		get: {
			'/users': () => {
				return this.users;
			},
			'/user': (data: {id: number}) => {
				return this.users[data.id];
			}
		},
		post: {
			'/user': (data: User) => {
				this.users.push(data);
				return true;
			}
		},
		put: {
			'/user': (data) => {
				let user = this.users[data.index];
				if (user !== undefined) {
					Object.assign(user, data.user);
					return true;
				} else {
					return false;
				}
			}
		},
		patch: {
			'/user': (data) => {
				let user = this.users[data.index];
				if (user !== undefined) {
					user[data.userKey] = data.userValue;
					return true;
				} else {
					return false;
				}
			}
		},
		delete: {
			'/user': (data) => {
				let user = this.users[data.index];
				if (user !== undefined) {
					this.users.splice(data.index, 1);
					return true;
				} else {
					return false;
				}
			}
		}
	};
}

export class Client extends ExpressClient<API> {}
