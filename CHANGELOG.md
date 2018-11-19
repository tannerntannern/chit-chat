# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
