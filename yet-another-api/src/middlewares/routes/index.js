const {
    walk
} = require('../../utils');

const middlewares = walk(__dirname).reduce((prev, acc) => {
    return typeof Object.values(acc)[0] === 'function' ? Object.assign({}, prev, acc) : prev;
});

module.exports = middlewares