const {
  walk
} = require('../utils');

module.exports = walk('./').reduce((prev, acc) => {
  return Object.assign({}, prev, acc)
});