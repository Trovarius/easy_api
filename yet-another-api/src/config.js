const nconf = require('nconf');
const ROOT_PATH = process.cwd();
const path = require("path");

module.exports = nconf
  .argv()
  .env()
  .file(path.join(process.cwd(), `yaa-config.${process.env.NODE_ENV}.json`))
  .file(path.join(process.cwd(), 'yaa-config.json'))
  .defaults({
    "actorsDir": path.join(process.cwd(), "src/actors/"),
    "middlewaresDir": path.join(process.cwd(), "src/middlewares/"),
    "PORT": 4000,
    "clusters": 1,
    "cors": {
      "allowedOrigins": "*",
      "headers": "*"
    }
  });