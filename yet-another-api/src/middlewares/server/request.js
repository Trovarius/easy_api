const request = require('request');
var rp = require('request-promise');

module.exports = (options) => (req, res, next) => {
  if (options) {
    Object.keys(options.request).forEach(x => {
      const request_config = options.request[x];

      const call = (method) => (params) => {
        return rp(Object.assign({
            method: 'GET',
            uri: `${request_config.baseUrl}\\${action}`,
            json: true
          },
          request_config.options,
          params
        ))
      }

      req[`${x}`] = {
        'get': call('get'),
        'post': call('post'),
        'put': call('put'),
        'delete': call('delete'),
        'path': call('path'),
      }
    })
  }

  next();
}