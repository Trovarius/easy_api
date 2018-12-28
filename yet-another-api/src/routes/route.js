const fs = require('fs');
var express = require('express')
var router = express.Router()
const config = require('../config')
const {
  walk
} = require('../utils');

let middlewares = [];
const middlewaresfiles = walk(config.get('middlewaresDir'));
if (config.get('middlewaresDir') && middlewaresfiles.length) {

  let middlewares = middlewaresfiles.reduce((prev, acc) => {
    return Object.assign({}, prev, acc)
  })
}

const getEventMiddlewares = (eventConfig) => {
  if (!eventConfig.middlewares || !eventConfig.middlewares.length || !middlewares.length) return []

  return eventConfig.middlewares.map(x => {
    const middleware = middlewares[x]
    if (middleware) {
      return middleware;
    }
  })
}

const buildActor = (actorPath, actorConfig) => {

  const defaultConfig = {
    route: actorPath,
    method: 'get',
    action: (req, res, next) => {
      console.log('actor not implemented');
      next()
    }
  }

  if (typeof actorConfig == 'function') {
    return {
      ...defaultConfig,
      action: actorConfig
    }
  }

  return {
    ...defaultConfig,
    ...actorConfig
  }
}

module.exports = () => {

  walk(config.get('actorsDir')).forEach(x => {
    console.log('initialzing route by file: ', Object.keys(x))

    const eventConfig = buildActor(Object.keys(x)[0], Object.values(x)[0]);

    if (!eventConfig.method) {
      console.log("Method for doest exists:", eventConfig.method.toLowerCase())
    }

    console.log(eventConfig);

    const eventMiddlewares = []; // getEventMiddlewares(eventConfig);

    switch (eventConfig.method.toLowerCase()) {
      case "post":
        router.post(eventConfig.route, [...eventMiddlewares], eventConfig.action)
        break;
      case "put":
        router.put(eventConfig.route, [...eventMiddlewares], eventConfig.action)
        break;
      case "delete":
        router.delete(eventConfig.route, [...eventMiddlewares], eventConfig.action)
        break;
      default:
        router.get(eventConfig.route, [...eventMiddlewares], eventConfig.action)
        break;
    }
  })

  return router;
}