const fs = require('fs');
var express = require('express')
var router = express.Router()
const config = require('../config')
const {
  walk
} = require('../utils');

let routeMiddlewares = require('../middlewares/routes');

console.log(routeMiddlewares)

const getRouteMiddlewares = (actorConfig) => {

  let routeMiddleware = Object.values(routeMiddlewares).map(middleware => middleware(actorConfig))

  if (!actorConfig.middlewares || !actorConfig.middlewares.length || !middlewares.length) {
    return routeMiddleware;
  }

  return actorConfig.middlewares.map(x => {
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
    public: true,
    contentType: 'json',
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

const buildActorResult = (result) => {
  let defaultResult = {
    statusCode: 200,
    data: null
  }

  if (!isObject(result) || !result.hasOwnProperty('statusCode')) {
    return Object.assign({}, defaultResult, {
      data: result
    })
  }

  return Object.assign({}, defaultResult, result);
}

function isObject(val) {
  return val instanceof Object;
}

const routeCallback = (actorConfig) => (req, res, next) => {
  const result = actorConfig.action({
    ...req.query,
    ...req.body
  })

  const {
    statusCode,
    data
  } = buildActorResult(result);

  if (actorConfig.contentType === 'json')
    res.status(statusCode).json(data)
  else
    res.status(statusCode).send(data)

  next();
};

module.exports = () => {

  walk(config.get('actorsDir')).forEach(x => {
    console.log('initialzing route by file: ', Object.keys(x))

    const actorConfig = buildActor(Object.keys(x)[0], Object.values(x)[0]);

    if (!actorConfig.method) {
      console.log("Method for doest exists:", actorConfig.method.toLowerCase())
    }

    console.log(actorConfig);

    const eventMiddlewares = getRouteMiddlewares(actorConfig);

    switch (actorConfig.method.toLowerCase()) {
      case "post":
        router.post(actorConfig.route, [...eventMiddlewares], routeCallback(actorConfig))
        break;
      case "put":
        router.put(actorConfig.route, [...eventMiddlewares], routeCallback(actorConfig))
        break;
      case "delete":
        router.delete(actorConfig.route, [...eventMiddlewares], routeCallback(actorConfig))
        break;
      default:
        router.get(actorConfig.route, [...eventMiddlewares], routeCallback(actorConfig))
        break;
    }
  })

  return router;
}