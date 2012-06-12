({
    appDir: '.',
    baseUrl: 'js',
    dir: '../demo-built',
    name: 'lib',

    //Exclude jquery from the built lib,
    //since it is used in the index.html
    //directly too, and demonstrates
    //async loading.
    exclude: ['jquery'],

    //Comment this line out to get
    //minified content.
    optimize: 'none',

    //Instruct the r.js optimizer to
    //convert commonjs-looking code
    //to AMD style, which is needed for
    //the optimizer to properly trace
    //dependencies.
    cjsTranslate: true
})