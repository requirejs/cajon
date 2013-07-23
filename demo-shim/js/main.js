require.config({
    baseUrl: 'js',
    shim: {
        shimDeal: {
            exports: 'shimDeal'
        },

        underscore: {
            exports: '_'
        },

        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require(['backbone', 'shimDeal'], function (Backbone, sd) {
    console.log('shimDeal\'s name: ' + sd.name);
    console.log('shimDeal\'s global name: ' + shimDeal.name);
    console.log('Backbone is: ', Backbone);
    console.log('Backbone.$ is: ', Backbone.$);
});