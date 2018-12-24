const {
  walk
} = require('../utils');

const time = require('./request')

const middlewares = walk(__dirname).reduce((prev, acc) => {
  return Object.assign({}, prev, acc)
});

console.log(middlewares);

module.exports = middlewares