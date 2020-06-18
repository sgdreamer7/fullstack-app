/* eslint import/imports-first:0  import/newline-after-import:0 */
const express = require('express');
const { promisify } = require('../../packages');

const logger = require('../logger');
const middlewares = require('./middlewares');
const adminRouter = require('./admin/router');
const mainRouter = require('./main/router');

const app = express();

app.use(middlewares.json);
app.use(middlewares.clsMiddleware);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
app.use(middlewares.include);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1', mainRouter);

let server = null;

const start = ({ appPort }) => {
  server = app.listen(appPort, () => {
    const { port, address } = server.address();
    logger.info(`[RestApiApp] STARTING AT PORT [${port}] ADDRESS [${address}]`);
  });

  server.closeAsync = promisify(server.close);
};

const stop = async () => {
  if (!server) return;
  logger.info('[RestApiApp] Closing server');
  await server.closeAsync();
};

module.exports = { default: app, start, stop };
