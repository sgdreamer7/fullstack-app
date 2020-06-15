'use strict';

const { worker, fsp, path } = require('./dependencies.js');

(async () => {
  console.log(`Application started in worker ${worker.threadId}`);
  worker.parentPort.on('message', async (message) => {
    if (message.name === 'stop') {
      console.log(`Graceful shutdown in worker ${worker.threadId}`);
      process.exit(0);
    }
  });

  const logError = (err) => {
    console.error(err.stack);
  };

  process.on('uncaughtException', logError);
  process.on('warning', logError);
  process.on('unhandledRejection', logError);
})();
