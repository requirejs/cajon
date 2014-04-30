require({
        baseUrl: './',
        paths: {
            'a': 'data:text/javascript,define([], function() { return { name: "a" }; })'
        }
    },
    ['a'], function(a) {
        doh.register(
            "dataUrl",
            [
                function dataUrl(t){
                    t.is('a', a.name);
                }
            ]
        );
        doh.run();
    }
);
