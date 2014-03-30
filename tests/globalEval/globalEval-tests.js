require({
        baseUrl: './',
        shim: {
            'second': {
                deps: ['global']
            }
        }
    },
    ['second'], function() {
        doh.register(
            "globalEval",
            [
                function globalEval(t){
                    t.is('myGlobal and mySecond', mySecond.name);
                }
            ]
        );
        doh.run();
    }
);
