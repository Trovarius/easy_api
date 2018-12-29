const {
  walk,
  isObject,
  toCamelCase
} = require('../utils');

const config = require('../config')

const buildActor = (actorPath, actorConfig) => {

  const defaultConfig = {
    route: actorPath,
    name: toCamelCase(actorPath.replace(/[/]/ig, ' ')),
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

const loadActors = () => {
  return walk(config.get('actorsDir')).map(x => buildActor(Object.keys(x)[0], Object.values(x)[0]));
}

module.exports = {
  loadActors,
  buildActorResult,
}