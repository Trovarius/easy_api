const nconf = require('nconf');
const ROOT_PATH = process.cwd();
const path  = require("path");

module.exports = nconf.argv()
.env()
.defaults({
  "eventsDir": path.join(process.cwd(), "src/events/"),
  "handlersDir": path.join(process.cwd(), "src/handlers/"),
  "middlewaresDir": path.join(process.cwd(), "src/middlewares/"),
  "PORT": 3000,
  "corsOptions": {
    "allowedOrigins": "*",
    "headers": "*"
  }
})
.file({ file: ROOT_PATH + '/easy-api.json' });
