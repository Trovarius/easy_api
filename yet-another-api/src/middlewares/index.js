const {
  walk
} = require('../utils');

const middlewares = walk(__dirname).reduce((prev, acc) => {
  return Object.assign({}, prev, acc)
});

module.exports = middlewares