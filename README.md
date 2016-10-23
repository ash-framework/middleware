<!-- TITLE/ -->

<h1>@ash-framework/middleware</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-badge"><a href="https://mediasuite.co.nz" title="The Media Suite"><img src="https://mediasuite.co.nz/ms-badge.png" alt="The Media Suite" /></a></span>
<br class="badge-separator" />
<span class="badge-badge"><a href="https://nodei.co/npm/@ash-framework/middleware"><img src="https://nodei.co/npm/@ash-framework/middleware.png?downloads=true&stars=true" /></a></span>
<br class="badge-separator" />
<span class="badge-travisci"><a href="http://travis-ci.org/ash-framework/middleware" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/ash-framework/middleware/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/@ash-framework/middleware" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@ash-framework/middleware.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@ash-framework/middleware" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@ash-framework/middleware.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/ash-framework/middleware" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/ash-framework/middleware.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/ash-framework/middleware#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/ash-framework/middleware.svg" alt="Dev Dependency Status" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Middleware support for ash framework

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>
<li>Install: <code>npm install --save @ash-framework/middleware</code></li>
<li>Module: <code>require('@ash-framework/middleware')</code></li></ul>

<!-- /INSTALL -->


## Usage

Loads middleware from a specified directory or from inline express style middleware functions.

### Defining middleware routing

#### Basic routing

Define a nested function to specify which middleware to load and in what order.
```js
const middleware = function () {
  this.middleware('token')
  this.middleware('user')
}
```

In the example above, token middleware will be loaded before user middleware.

#### this.middleware

```js
this.middleware(name|express middleware, [options|callback])
```

The `this.middleware` function takes the name of the middleware as the first parameter (or alternatively
an express middleware function can be passed to bypass middleware loading and be used instead
See [Inlining middleware](#inlining-middleware))
The second optional parameter is either an options object to be passed to the middleware
to be loaded (See [Loading middleware](#loading-middleware))
or a callback function to be used for grouping middleware. (See [Loading middleware](#grouping-middleware))

#### Grouping middleware

Middleware can be grouped using nesting. This has no application other than to help you to
group your middleware in a way that makes sense for your application.

```js
const middleware = function () {
  this.middleware('security', function () {
    this.middleware('token')
    this.middleware('csrf')
  })
  this.middleware('user')
}
```

In the above example, `token` middleware will run followed by `csrf` and then finally `user`. No middleware is
run for `security` itself as this is just a namespace.

#### Inlining middleware

The `this.middleware` function can also take an express style middleware callback of the form `function (req, res, next) {}`
The main intended use for this is so that you can load external middleware.

```js
const helmet = require('helmet')

const middleware = function () {
  this.middleware(helmet())
}
```

or simply

```js
const middleware = function () {
  this.middleware(function (req, res, next) {
    // do something
    next()
  })
}
```

### Loading middleware

Loading middleware involves passing a definition function (See [defining middleware routing](#defining-middleware-routing)),
an express `app` instance and a path to a directory of route files to load from.

```js
const express = require('express')
const load = require('@ash-framework/middleware')
const path = require('path')

const middlewareDefinition = function () {
  this.middleware('token')
}
const expressApp = express()
const middlewareDirectory = path.join(__dirname, 'middleware')

load(middlewareDefinition, expressApp, middlewareDirectory)
```

### Defining middleware

When `this.middleware(name)` is called, the module will attempt to look up a file named `name` in the directory defined
in `middlewareDirectory` (See [Loading Middleware](loading-middleware)).

```js
const app = express()

load(function () {
  this.middleware('user')
}, app, __dirname + '/middleware')
```

In the example above, a file name `user.js` will be looked for and loaded if it exists. (A descriptive error will thrown if it
does not).

Loaded files should export a class with a method `register`

```js
// user.js
module.exports = class Middleware {
  register (httpContext, options) {
    // return a promise if you want subsequent middleware to wait
    return Promise.resolve()
  }
}
```

#### httpContext

`httpContext` is a wrapper for express request and response objects.
It is an object with 4 properties as follows.
- request - express request object
- response - express response object
- get - property getting
- set - property setter

If you `set` something on httpContext in one middleware class, it will be available
via `get` in later middleware classes.

```js
const app = express()

const definition = function () {
  this.middleware('token')
  this.middleware('user')
}
load(definition, app, __dirname + '/middleware')

// token.js
module.exports = class Middleware {
  register (httpContext, options) {
    httpContext.set('token', 'ABC1234')
  }
}

// user.js
module.exports = class Middleware {
  register (httpContext, options) {
    const token = httpContext.get('token') // ABC1234
  }
}
```

#### options

`options` is an object passed through from the middleware definition

```js
const app = express()

const definition = function () {
  this.middleware('token', {type: 'csrf'})
}
load(definition, app, __dirname + '/middleware')

// token.js
module.exports = class Middleware {
  register (httpContext, options) {
    console.log(options.type) // csrf
  }
}
```

<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/ash-framework/middleware/releases">Discover the release history by heading on over to the releases page.</a>

<!-- /HISTORY -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li>Richard Walker digitalsadhu@gmail.com</li></ul>

<h3>Sponsors</h3>

These amazing people have contributed finances to this project:

<ul><li><a href="http://mediasuite.co.nz">The Media Suite</a></li></ul>

Become a sponsor!



<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://lovebeer.nz/">Richard Walker</a> — <a href="https://github.com/ash-framework/middleware/commits?author=digitalsadhu" title="View the GitHub contributions of Richard Walker on repository ash-framework/middleware">view contributions</a></li></ul>



<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://lovebeer.nz/">Richard Walker</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
