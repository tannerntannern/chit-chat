# table-talk
[![npm version](https://badge.fury.io/js/table-talk.svg)](https://badge.fury.io/js/table-talk)
[![Build Status](https://travis-ci.org/tannerntannern/table-talk.svg?branch=master)](https://travis-ci.org/tannerntannern/table-talk)
[![Coverage Status](https://coveralls.io/repos/github/tannerntannern/table-talk/badge.svg?branch=master)](https://coveralls.io/github/tannerntannern/table-talk?branch=master)
[![Dependencies Status](https://david-dm.org/tannerntannern/table-talk/status.svg)](https://david-dm.org/tannerntannern/table-talk)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A simple HTTP and socket server library built for TypeScript on Node.js.

The primary goal of this library is to provide a framework that facilitates the design of a clear and error-free
communication structure between the server and client:
* every message that is sent needs to have a corresponding message handler on the other side
* all messages should have a well-defined format
* At no point should the programmer be able to mistakenly send the wrong arguments because they misread the docs

All of these things are guaranteed by the clever typing system.

# Getting Started
## Installation
Via [npm](https://npmjs.com/table-talk):

`npm install table-talk`

## Documentation
Detailed documentation can be found at [tannerntannern.github.io/table-talk](https://tannerntannern.github.io/table-talk/).
For help getting started, keep reading.

## Examples
* [Creating an HTTP Server/Client](#creating-an-http-serverclient)
* [Creating a Socket Server/Client](#creating-a-socket-serverclient)

### Creating an HTTP Server/Client
Start by sketching an API that you want implemented:

```typescript
import {ExpressServerManager, ExpressClient} from 'table-talk';

type User = {
	name: string,
	age: number
}

interface API {
	get: {
		'/users': {args: {}, return: User[]},
		'/user': {args: {id: number}, return: User}
	},
	post: {
		'/user': {args: User, return: boolean}
	},
	delete: {
		'/user': {args: {index: number}, return: boolean}
	}
}
```

Then create a ServerManager and Client class that implement the API.  The typings will
ensure that all the `httpHandlers` are implemented properly:
```typescript
class ServerManager extends ExpressServerManager<API> {
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

export class Client extends ExpressClient<API> {
	// Nothing to implement here
}
```

Then start up the server and bask in the type-protected glory:
```typescript
let {server, manager} = ServerManager.makeServer({port: 3000});
let client = new Client('http://localhost:3000');

await server.start();

// Then on the client side:

// This works
let user: User = await client.get('/user', {id: 0});

// This won't work because the passed object is not properly typed; missing prop 'age'
await client.post('/user', {name: 'Josh'});
```

### Creating a Socket Server/Client
Coming soon...

# Author
Tanner Nielsen <tannerntannern@gmail.com>
* Website - [tannernielsen.com](http://tannernielsen.com)
* Github - [github.com/tannerntannern](https://github.com/tannerntannern)