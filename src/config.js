const nconf = require('nconf');
const ROOT_PATH = process.cwd();
const path  = require("path");

module.exports = nconf.argv()
.env()
.defaults({
  "routeDir": path.join(process.cwd(), "src/events"),
  "handlerDir": path.join(process.cwd(), "src/handlers"),
  "PORT": 3000,
  "corsOptions": {
    "allowedOrigins": "*",
    "headers": "*"
  }
})
.file({ file: ROOT_PATH + '/easy-api.json' });
