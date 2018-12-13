const nconf = require('nconf');
const ROOT_PATH = process.cwd();

module.exports = nconf.argv()
.env()
.defaults({
  "routeDir": "./events",
  "handlerDir": "./handlers",
  "PORT": 3000,
  "corsOptions": {
    "allowedOrigins": "*",
    "headers": "*"
  }
})
.file({ file: ROOT_PATH + '/easy-api.json' });
