const ROOT_PATH = process.cwd();
const server = require('./src/server');

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

  server.start((err, data) => {
    if (err) {
      console.log('[APP] initialization failed', err);
    } else {
      console.log('[APP] initialized SUCCESSFULLY');
    }
  })
