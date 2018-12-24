const morgan = require('morgan')

module.exports = (options) => {
  return morgan('combined');
}