#!/usr/bin/env node

const ROOT_PATH = process.cwd();
const server = require('../src/server');
const config = require('../src/config');
var fs = require('fs');
const cluster = require('cluster');
const os = require('os');
let workers = [];

const shutdown = () => {
  console.log('Gracefully shutdown in progress');
  server.stop(() => {
    console.log('Express server stopped');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown)
  .on('SIGINT', shutdown)
  .on('SIGHUP', shutdown)
  .on('uncaughtException', (err) => {
    console.log('uncaughtException caught the error: ', err);
    console.log('uncaughtException caught the error: ', err.message);
    throw err;
  })
  .on('exit', (code) => {
    console.log('Node process exit with code: %s', code);
  });

if (!fs.existsSync('./src/events')) {
  fs.mkdirSync('./src/events');
}

if (!fs.existsSync('./src/middlewares')) {
  fs.mkdirSync('./src/middlewares');
}

if (!fs.existsSync('./src/handlers')) {
  fs.mkdirSync('./src/handlers');
}

if (config.get('clusters') <= 1) {
  server.start((err, data) => {
    if (err) {
      console.log('[APP] initialization failed', err);
    } else {
      console.log('[APP] initialized SUCCESSFULLY');
    }
  })
} else if (cluster.isMaster) {

  for (let i = 0; i < os.cpus().length; i++) {
    if (i <= config.get('clusters')) {
      const worker = cluster.fork();

      workers.push(worker);

      // Listen for messages from worker
      worker.on('message', function (message) {
        console.log(`Master ${process.pid} recevies message '${JSON.stringify(message)}' from worker ${worker.process.pid}`);
      });
    }
  }

  cluster.on('exit', function () {
    console.log(`Worker ${process.pid} stopped`);
  });

} else {
  server.start((err, data) => {
    if (err) {
      console.log('[APP] initialization failed', err);
    } else {
      console.log('[APP] initialized SUCCESSFULLY');

      process.on('message', function (message) {
        console.log(`Worker ${process.pid} recevies message '${JSON.stringify(message)}'`);
      });
    }
  })
}