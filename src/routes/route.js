const fs = require('fs');
var express = require('express')
var router = express.Router()


const {
  routeDir
} = require('../config')

var walk = function (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (fileName) {
    file = dir + '/' + fileName;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push({
        [fileName]: require(file)
      });
    }
  });
  return results;
}

var normalizedPath = (path) => require("path").join(process.cwd(), "src", path);

const middlewares = walk(normalizedPath("middlewares")).reduce((prev, acc) => {
  return Object.assign({}, prev, acc)
})

const getEventMiddlewares = (eventConfig) => {
  if (!eventConfig.middlewares || !eventConfig.middlewares.length) return []

  console.log(middlewares);
  return eventConfig.middlewares.map(x => {
    const middleware = middlewares[x]
    if (middleware) {
      return middleware;
    }
  })
}

const getEventHandlers = (eventConfig) => {
  if (!eventConfig.handlers || !eventConfig.handlers.length) return []

  return eventConfig.handlers.map(handler => {
    return require(normalizedPath('handlers/' + handler.name))
  })
}

module.exports = () => {

  walk(normalizedPath('events')).forEach(x => {
    console.log('initialzing route by file: ', Object.keys(x))

    const eventConfig = Object.values(x)[0];

    if (!eventConfig.method) {
      console.log("Method for doest exists:", eventConfig.method.toLowerCase())
    }

    const eventMiddlewares = getEventMiddlewares(eventConfig);
    const eventHandlers = getEventHandlers(eventConfig);

    router.get(eventConfig.route, [...eventMiddlewares, ...eventHandlers], (req, res, next) => {
      next();
    })
  })

  return router;
}