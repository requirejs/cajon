# cajon

[Cajon](http://en.wikipedia.org/wiki/Caj%C3%B3n) is a JavaScript module loader
for the browser that can load CommonJS/node and AMD modules. It is built
on top of [RequireJS](https://github.com/jrburke/requirejs).

You can use it to code modules for your project in CommonJS/node style, then
use the [RequireJS Optimizer](http://requirejs.org/docs/optimization.html) to
build all the modules into an AMD-compliant bundle. This allows you to
then use a small AMD API shim, like
[almond](https://github.com/jrburke/almond), to get nicely optimized code
without needing a full runtime loader.

## Why?

Why use this instead of RequireJS? Some possible reasons:

1) You cannot bring yourself to use a wrapper like this around your module
code:

```javascript
define(function(require) {
    /*module code here */
});
```

2) You have a set of code already formatted in CommonJS/node style you
want to reuse.

Otherwise, you should be using RequireJS, or another AMD loader.

Note the [Restrictions](#restrictions) section below. You will likely gnash your
teeth in frustration if you do not heed them.

If you do not like this particular loader, but like the idea of a
dual AMD and CommonJS/node style module loader, then you may like
LinkedIn's [Inject](https://github.com/linkedin/inject) loader better.

## How does it work?

Cajon is constructed with:

* RequireJS (needs 2.0.2 or later)
* An override to requirejs.load that fetches scripts via async
XHR requests then evals them, using the `//@ sourceURL=` to
specify the script names for script debuggers.

Cajon will only use the XHR+eval approach if the request is to the
same domain as the HTML document. If the script request is deemed to be on
another domain, it will just delegate to the default requirejs.load()
function, where it will load the script with a `<script>` tag, and expect it
to be in AMD format, or a traditional "browser globals" script.

You can override this behavior to use XHR for some cross domain requests if
you know your users will be using CORS-enabled browsers and servers.
See the **Configuration** section below.

Scripts that are fetched are wrapped in the following
[AMD wrapper](http://requirejs.org/docs/whyamd.html#sugar):

```javascript
define(function (require, exports, module) {
    /* module code here */
});
```

and it allows the use of __dirname and __filename inside that
wrapped code.

Cajon assigns the `cajon` variable to the be same as the `requirejs`
variable, so you can use that if you want to specifically call out the usage
of cajon. However, the requirejs optimizer only understands
of `require`, `requirejs` and `define`, it will not understand `cajon`. This is
particularly important if you are using the optimizer's `mainConfigFile`
option.

It is best to just use the global `require` if you want the code to be
portable to RequireJS, almond and other AMD loaders, and only do detection
of `cajon` if you want to know if cajon is available.

## How to use it

There is a `demo` directory that shows example use, but basically,
put cajon.js in a `<script>` tag and load modules via `require([])`.
Note the [Restrictions](#restrictions) section below though.

To optimize the demo, run:

    node tools/r.js -o demo/app.build.js

This will generate the optimized project in a `demo-built` directory. All
the modules in the build output will have been converted to AMD style, so
that they can be loaded cross-domain without needing special CORS
considerations.

The app.build.js build profile requires the r.js optimizer to be
version 2.0.2 or later, because it uses 2.0.2's `cjsTranslate` build option
that converts CommonJS/node modules to be define()-wrapped for the build.

## Install

If using [volo](https://github.com/volojs/volo):

    volo add cajon

If using npm:

    npm install cajon

Or URL to latest release:

    https://raw.github.com/requirejs/cajon/latest/cajon.js

## Restrictions

### Does not use node's module ID-to-path rules

So do not expect to `npm install` some code, then be able to require it
using cajon.

Node uses multiple `node_modules` path lookups to find code and this is not
efficient to do in a browser context. Also, many node modules depend on
node's standard library or Node's environment, which are not available by
default in the web browser.

If you do want to use some npm-installed code, and you know it will run
in the browser, you can get it to work with cajon, but you will likely
need to use the **paths**, **map** and **packages**
[requirejs config](http://requirejs.org/docs/api.html#config) to get it to
work.

### Avoid computed require('') calls.

CommonJS/node module systems are synchronous, local file IO systems. So
they allow these kinds of constructs:

```javascript
//first example
var id = someCondition ? 'a' : 'b';
var a = require(id);

//second example
var a;
if (someCondition) {
    a = require('a');
} else {
    b = require('b');
}
```

The first example will fail in an AMD browser environment, since all
dependencies need to be known, downloaded and executed before the code
runs. If 'a' and 'b' are not already in that state, that first example
will likely generate an error.

The second example can work, but know that the AMD loader will download
and execute 'a' and 'b' before running that code.

If you use a runtime decision to grab a dependency, use the callback-style
require() supported by AMD loaders:

```javascript
var id = someCondition ? 'a' : 'b';
require([id], function (mod) {
    //do something with mod now
    //that it has been asynchronously
    //loaded and executed.
})
```

Or consider creating an AMD loader plugin that can do the decision logic
but still be treated as a single string literal dependency:

```javascript
var dep = require('has!condition?succesModuleId:failModuleId');
```

Both callback-style require and loader plugins are usable with cajon
since it is just using requirejs behind the scenes.

## Configuration

Cajon will only use the XHR+eval approach if the request is to the
same domain as the HTML document. You can override this behavior
if you know CORS-enabled browsers and servers will be used.

Set up a `useXhr` function in a `cajon` config passed to the loader:

```javascript
require.config({
    cajon: {
        useXhr: function (url, protocol, hostname, port) {
            //Return true if XHR is usable, false if the
            //script tag approach to an AMD module/browser globals
            //script should be used.

            //url is the url being requested.
            //protocol, hostname and port area all values from the
            //current page that is using cajon. Compare them with
            //what is in `url` to make your decision.
        }
    }
});
```

If you need to configure each XHR object before it sends out its request,
you can implement an `onXhr` method that gets called after xhr.open(), but
before xhr.onreadystatechange() is set up and before xhr.send() is called:

```javascript
require.config({
    cajon: {
        onXhr: function (xhr, url) {
            //xhr is the XHMLHttpRequest object.
            //url is the URL the xhr object is set to use.
        }
    }
});
```

## License

MIT

## Code of Conduct

[jQuery Foundation Code of Conduct](https://jquery.org/conduct/).


