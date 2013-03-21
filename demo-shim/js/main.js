require.config({
    baseUrl: 'js',
    shim: {
        underscore: {
            exports: '_'
        },

        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require(['backbone'], function (Backbone) {
    console.log('Backbone is: ', Backbone);
    console.log('Backbone.$ is: ', Backbone.$);
});