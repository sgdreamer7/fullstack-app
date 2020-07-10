const { Worker } = require('worker_threads');
const path = require('path');

const config = require('./config');

const CTRL_C = 3;

const main = async () => {
  const ports = config.server.ports.split(',').map((port) => Number.parseInt(port, 10));
  const count = ports.length;
  let active = count;
  const workers = new Array(count);

  const start = (id) => {
    const workerPath = path.join(__dirname, './worker.js');
    const worker = new Worker(workerPath);
    workers[id] = worker;
    worker.on('exit', (code) => {
      if (code !== 0) start(id);
      // eslint-disable-next-line no-plusplus
      else if (--active === 0) process.exit(0);
    });
  };

  // eslint-disable-next-line no-plusplus
  for (let id = 0; id < count; id++) start(id);

  const stop = async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const worker of workers) {
      worker.postMessage({ name: 'stop' });
    }
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);

    // eslint-disable-next-line no-console
    console.error({
      type: 'UncaughtException',
      error: error.stack
    });
  });

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.on('data', (data) => {
      const key = data[0];
      if (key === CTRL_C) stop();
    });
  }
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
