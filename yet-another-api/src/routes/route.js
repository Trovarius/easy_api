const fs = require('fs');
var express = require('express')
const config = require('../config')
const {
  loadActors,
  buildActorResult
} = require('../actors');

const {
  $event
} = require('../eventSource');

var router = express.Router()

const {
  walk
} = require('../utils');

let routeMiddlewares = require('../middlewares/routes');

console.log(routeMiddlewares)

const getRouteMiddlewares = (actorConfig) => {

  let routeMiddleware = Object.values(routeMiddlewares).map(middleware => middleware(actorConfig))

  if (!actorConfig.middlewares || !actorConfig.middlewares.length) {
    return routeMiddleware;
  }

  return [...routeMiddleware, ...actorConfig.middlewares]
}

const routeCallback = (actorConfig) => async (req, res, next) => {

  actorConfig.$event = $event;

  console.log(req.params);

  const result = await actorConfig.action({
    ...req.params,
    ...req.query,
    ...req.body,
    $event
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
  const actors = loadActors();

  actors.forEach(actorConfig => {
    console.log('initialazing route: ', actorConfig)

    if (!actorConfig.method) {
      console.log("Method doest exists:", actorConfig)
    }

    $event.register(actorConfig);

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