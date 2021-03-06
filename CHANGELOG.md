# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.1.0-beta.1"></a>
# [2.1.0-beta.1](https://github.com/tannerntannern/table-talk/compare/v2.1.0-beta.0...v2.1.0-beta.1) (2018-12-03)


### Features

* added an easy way to bypass the connection event on '/' when connecting to a different namespace ([6839059](https://github.com/tannerntannern/table-talk/commit/6839059))



<a name="2.1.0-beta.0"></a>
# [2.1.0-beta.0](https://github.com/tannerntannern/table-talk/compare/v2.0.0-beta.2...v2.1.0-beta.0) (2018-11-30)


### Features

* made ServerManagers' setup priorities configurable ([9cbda87](https://github.com/tannerntannern/table-talk/commit/9cbda87))



<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/tannerntannern/table-talk/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2018-11-29)


### Bug Fixes

* added some code to ensure that ExpressServerManagers ALWAYS get setup first ([9c139d3](https://github.com/tannerntannern/table-talk/commit/9c139d3))



<a name="2.0.0-beta.1"></a>
# [2.0.0-beta.1](https://github.com/tannerntannern/table-talk/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2018-11-28)


### Bug Fixes

* fixed major typo in the SocketClient that prevented proper connections ([b3d19bc](https://github.com/tannerntannern/table-talk/commit/b3d19bc))



<a name="2.0.0-beta.0"></a>
# [2.0.0-beta.0](https://github.com/tannerntannern/table-talk/compare/v2.0.0-alpha.4...v2.0.0-beta.0) (2018-11-26)



<a name="2.0.0-alpha.4"></a>
# 2.0.0-alpha.4 (2018-11-26)


### Features

* made the HttpServer publicly accessible from ServerManagers ([cedf02c](https://github.com/tannerntannern/table-talk/commit/cedf02c))



<a name="2.0.0-alpha.3"></a>
# [2.0.0-alpha.3](https://github.com/tannerntannern/table-talk/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2018-11-26)


### Bug Fixes

* corrected broken types in the express-client ([d4e756d](https://github.com/tannerntannern/table-talk/commit/d4e756d))



<a name="2.0.0-alpha.2"></a>
# [2.0.0-alpha.2](https://github.com/tannerntannern/table-talk/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2018-11-26)


### Bug Fixes

* corrected an issue where configs weren't properly passed through extended constructors ([622dfe6](https://github.com/tannerntannern/table-talk/commit/622dfe6))



<a name="2.0.0-alpha.1"></a>
# [2.0.0-alpha.1](https://github.com/tannerntannern/table-talk/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2018-11-26)


### Bug Fixes

* added forgotten files to tsconfig ([1e6fbad](https://github.com/tannerntannern/table-talk/commit/1e6fbad))
* removed forgotten import ([dcd9c93](https://github.com/tannerntannern/table-talk/commit/dcd9c93))


### Features

* added separate client and server exports to hopefully make tree-shaking work properly ([635648b](https://github.com/tannerntannern/table-talk/commit/635648b))



<a name="2.0.0-alpha.0"></a>
# [2.0.0-alpha.0](https://github.com/tannerntannern/table-talk/compare/v1.0.0-beta.5...v2.0.0-alpha.0) (2018-11-26)


### Features

* BREAKING CHANGE: made socket.io-client and axios external modules ([38b1ce3](https://github.com/tannerntannern/table-talk/commit/38b1ce3))



<a name="1.0.0-beta.5"></a>
# [1.0.0-beta.5](https://github.com/tannerntannern/table-talk/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2018-11-24)


### Bug Fixes

* changed the module format back to commonjs for compatibility ([8248f4a](https://github.com/tannerntannern/table-talk/commit/8248f4a))



<a name="1.0.0-beta.4"></a>
# [1.0.0-beta.4](https://github.com/tannerntannern/table-talk/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2018-11-24)


### Bug Fixes

* finally resolved type issue with http-interface ([59c8687](https://github.com/tannerntannern/table-talk/commit/59c8687))



<a name="1.0.0-beta.3"></a>
# [1.0.0-beta.3](https://github.com/tannerntannern/table-talk/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2018-11-24)


### Bug Fixes

* manually included socket.io-client typings to fix compilation issues ([473532c](https://github.com/tannerntannern/table-talk/commit/473532c))
* **lint:** missing semicolon ([83a1897](https://github.com/tannerntannern/table-talk/commit/83a1897))



<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/tannerntannern/table-talk/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2018-11-23)


### Features

* made blockEvent() have the ability to timeout when the event never arrives ([203e977](https://github.com/tannerntannern/table-talk/commit/203e977))



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/tannerntannern/table-talk/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2018-11-23)


### Features

* BREAKING CHANGE: changed format of HandlerCtx and made it possible for ServerManagers to communicate ([0b24de7](https://github.com/tannerntannern/table-talk/commit/0b24de7))



<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/tannerntannern/table-talk/compare/v1.0.0-alpha.1...v1.0.0-beta.0) (2018-11-23)


### Features

* BREAKING CHANGE: modified how ServerManagers attach to HttpServers for flexibility ([acc6d22](https://github.com/tannerntannern/table-talk/commit/acc6d22))



<a name="1.0.0-alpha.1"></a>
# [1.0.0-alpha.1](https://github.com/tannerntannern/table-talk/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2018-11-22)


### Bug Fixes

* reverted typescript-eslint-parser back to v19 ([6220032](https://github.com/tannerntannern/table-talk/commit/6220032))


### Features

* BREAKING CHANGE: introduced the concept of ServerManagers, which are less tightly coupled ([cf61659](https://github.com/tannerntannern/table-talk/commit/cf61659))



<a name="1.0.0-alpha.0"></a>
# [1.0.0-alpha.0](https://github.com/tannerntannern/table-talk/compare/v0.2.0...v1.0.0-alpha.0) (2018-11-19)


### Features

* BREAKING CHANGE: extracted the shapes of socket and express servers as interfaces and exposed them ([f679fee](https://github.com/tannerntannern/table-talk/commit/f679fee))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/tannerntannern/table-talk/compare/v0.1.0...v0.2.0) (2018-11-18)


### Features

* exposed more types from the servers and interfaces ([837a8ac](https://github.com/tannerntannern/table-talk/commit/837a8ac))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/tannerntannern/table-talk/compare/v0.1.0-beta.2...v0.1.0) (2018-11-18)


### Features

* exposed the server configs ([16563d4](https://github.com/tannerntannern/table-talk/commit/16563d4))



<a name="0.1.0-beta.2"></a>
# [0.1.0-beta.2](https://github.com/tannerntannern/table-talk/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2018-11-17)


### Features

* BREAKING CHANGE: tweaked how requests work between ExpresServer and ExpressClient ([1b72822](https://github.com/tannerntannern/table-talk/commit/1b72822))



<a name="0.1.0-beta.1"></a>
# [0.1.0-beta.1](https://github.com/tannerntannern/table-talk/compare/v0.1.0-beta.0...v0.1.0-beta.1) (2018-11-14)


### Bug Fixes

* fixed lint error ([4290610](https://github.com/tannerntannern/table-talk/commit/4290610))



<a name="0.1.0-beta.0"></a>
# [0.1.0-beta.0](https://github.com/tannerntannern/table-talk/compare/v0.1.0-alpha.3...v0.1.0-beta.0) (2018-11-14)


### Bug Fixes

* finally got the ResponseTos<T> type to work ([bc75da2](https://github.com/tannerntannern/table-talk/commit/bc75da2))
* got EventHandlers working (basically) with the new `responseTo` feature ([095f85a](https://github.com/tannerntannern/table-talk/commit/095f85a))


### Features

* added a waitFor parameter to SocketClient#connect() to resolve connection issue ([f666770](https://github.com/tannerntannern/table-talk/commit/f666770))
* added SocketClient#blockEvent(event) ([c013c52](https://github.com/tannerntannern/table-talk/commit/c013c52))
* started work on the responseTo feature for socket interfaces ([3256c13](https://github.com/tannerntannern/table-talk/commit/3256c13))



<a name="0.1.0-alpha.3"></a>
# [0.1.0-alpha.3](https://github.com/tannerntannern/table-talk/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2018-11-04)


### Features

* implemented the SocketExpressClient ([90c6497](https://github.com/tannerntannern/table-talk/commit/90c6497))



<a name="0.1.0-alpha.2"></a>
# [0.1.0-alpha.2](https://github.com/tannerntannern/table-talk/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2018-11-03)


### Bug Fixes

* **build:** fixed issue with uncommitted files during release ([45a2ce3](https://github.com/tannerntannern/table-talk/commit/45a2ce3))



<a name="0.1.0-alpha.1"></a>
# [0.1.0-alpha.1](https://github.com/tannerntannern/table-talk/compare/v0.1.0-alpha.0...v0.1.0-alpha.1) (2018-11-03)


### Bug Fixes

* made HttpHandlers allow for handlers unspecified by the API ([51719a8](https://github.com/tannerntannern/table-talk/commit/51719a8))
* **lint:** fixed linter error ([8b620ad](https://github.com/tannerntannern/table-talk/commit/8b620ad))


### Features

* theoretically finished the SocketClient ([0f0e4cb](https://github.com/tannerntannern/table-talk/commit/0f0e4cb))



<a name="0.1.0-alpha.0"></a>
# [0.1.0-alpha.0](https://github.com/tannerntannern/table-talk/compare/v0.0.2-alpha.2...v0.1.0-alpha.0) (2018-10-31)


### Features

* made SocketInterface allow for extra handlers ([14ce4fd](https://github.com/tannerntannern/table-talk/commit/14ce4fd))



<a name="0.0.2-alpha.2"></a>
## [0.0.2-alpha.2](https://github.com/tannerntannern/table-talk/compare/v0.0.2-alpha.1...v0.0.2-alpha.2) (2018-10-31)
