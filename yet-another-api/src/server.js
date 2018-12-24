const ROOT_PATH = process.cwd();

const express = require('express')
const bodyParser = require("body-parser");
const compress = require('compression');
const partialResponse = require('express-partial-response');
const dynamic_routes = require('./routes/route');
const cors = require("cors");

const errorhandler = require('errorhandler')
const methodOverride = require('method-override')
const config = require('./config');
const pkg = require(`${ROOT_PATH}/package.json`);
const defaultMiddlewares = require('./middlewares');


const app = express()
//const port = 3000

const server = (() => {
  const env = process.env.NODE_ENV;
  let serverProcess;

  const start = (callback) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    Object.keys(defaultMiddlewares).forEach(middlewareName => {
      const middleware = defaultMiddlewares[middlewareName];

      app.use(middleware(config.get(middlewareName)));
    });

    if (process.env.NODE_ENV === 'development') {
      // only use in development
      app.use(errorhandler({
        log: errorNotification
      }))
    } else {
      app.use((err, req, res, next) => {
        res.status(500).send('Something went wrong!' + +err)
      })
    }

    function errorNotification(err, str, req) {
      const title = 'Error in ' + req.method + ' ' + req.url

      notifier.notify({
        title: title,
        message: str
      })
    }

    app.use('/', dynamic_routes());

    app.set('json spaces', 2);
    app.set('json replacer', (key, value) => {
      if (typeof value === 'undefined') {
        return null;
      }
      return value;
    });

    app.set('port', config.get('PORT'));

    app.use(cors(config.get('corsOptions')));
    app.use(compress());
    app.use(partialResponse());

    serverProcess = app.listen(app.get('port'), () => {
      console.log('------------------------------------------------------------------');
      console.log(`${pkg.name} - Version: ${pkg.version}`);
      console.log('------------------------------------------------------------------');
      console.log(`ATTENTION, ${env} ENVIRONMENT!`);
      console.log('------------------------------------------------------------------');
      console.log(`Express server listening on port: ${serverProcess.address().port}`);
      console.log('------------------------------------------------------------------');

      return callback(null, app);
    });
  };

  const stop = (callback) => {
    if (serverProcess) {
      serverProcess.close(callback);
    }
  };

  return {
    start,
    stop
  };
})();

module.exports = server;