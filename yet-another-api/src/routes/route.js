const fs = require('fs');
var express = require('express')
var router = express.Router()
const config = require('../config')

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

const middlewares = walk(config.get('middlewaresDir')).reduce((prev, acc) => {
  return Object.assign({}, prev, acc)
})

const getEventMiddlewares = (eventConfig) => {
  if (!eventConfig.middlewares || !eventConfig.middlewares.length) return []

  return eventConfig.middlewares.map(x => {
    const middleware = middlewares[x]
    if (middleware) {
      return middleware;
    }
  })
}

const handlerByType = (type, filePath) => {
  const spawn = require("child_process").spawn;
  console.log(type, filePath);
  return (req, res, next) => {
    if (type === "python") {
      const pythonProcess = spawn('python', [filePath + ".py", req, res]);

      pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        res.send(data.toString());
        next();
      });
    }
  }
}

const getEventHandlers = (eventConfig) => {
  if (!eventConfig.handlers || !eventConfig.handlers.length) return []

  return eventConfig.handlers.map(handler => {
    
    if (handler.type == "node")
      return require(config.get('handlersDir') + handler.name)
    else
      return handlerByType(handler.type, config.get('handlersDir') + handler.name)
  })
}

module.exports = () => {

  walk(config.get('eventsDir')).forEach(x => {
    console.log('initialzing route by file: ', Object.keys(x))

    const eventConfig = Object.values(x)[0];

    if (!eventConfig.method) {
      console.log("Method for doest exists:", eventConfig.method.toLowerCase())
    }

    const eventMiddlewares = getEventMiddlewares(eventConfig);
    const eventHandlers = getEventHandlers(eventConfig);


    switch (eventConfig.method.toLowerCase()) {
      case "post":
        router.post(eventConfig.route, [...eventMiddlewares, ...eventHandlers], (req, res, next) => {
          next();
        })
        break;
      case "put":
        router.put(eventConfig.route, [...eventMiddlewares, ...eventHandlers], (req, res, next) => {
          next();
        })
        break;
      case "delete":
        router.delete(eventConfig.route, [...eventMiddlewares, ...eventHandlers], (req, res, next) => {
          next();
        })
        break;

      default:
        router.get(eventConfig.route, [...eventMiddlewares, ...eventHandlers], (req, res, next) => {
          next();
        })
        break;
    }
  })

  return router;
}