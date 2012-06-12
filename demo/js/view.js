var model = require('./model'),
    helper = require('./util/helper'),
    $ = require('jquery');

console.log('__dirname: ' + __dirname);
console.log('__filename: ' + __filename);

module.exports = {
    render: function () {
        return 'view.render() works';
    },
    model: model,
    helper: helper,
    $: $
};
