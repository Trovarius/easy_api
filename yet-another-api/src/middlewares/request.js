const request = require('request');
var rp = require('request-promise');

module.exports = (options) => (req, res, next) => {
  if (options.request) {
    Object.keys(options.request).forEach(x => {
      const request_config = options.request[x];

      req[`${x}`] = {
        get({
          action,
          params,
        }) {
          return rp(Object.assign({
              method: 'GET',
              uri: `${request_config.baseUrl}\\${action}`,
              json: true
            },
            request_config.options,
            params
          ))
        },
        post({
          action,
          params,
        }) {
          return rp(Object.assign({
              method: 'POST',
              uri: `${request_config.baseUrl}\\${action}`,
              json: true
            },
            request_config.options,
            params
          ))
        }
      }
    })
  }

  next();
}