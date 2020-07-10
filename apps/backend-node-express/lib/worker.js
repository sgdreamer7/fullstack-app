const worker = require('worker_threads');
const API = require('./api/index');
const RestAPI = require('./api/rest-api/app');
const DomainModel = require('./domain-model/index');
const Logger = require('./infrastructure/Logger');
const EmailSender = require('./infrastructure/notificator/Mail');
const UseCaseBase = require('./use-cases/Base');
const config = require('./config');

(async () => {
  const logger = new Logger();
  const notificator = new EmailSender({
    mailOptions: config.mail,
    mainUrl: config.mainUrl
  });

  logger.info(`[App] Init Mode: ${process.env.MODE}`);

  // Init Controllers Layer (API)
  API.setLogger(logger);

  const { threadId } = worker;
  const ports = config.server.ports.split(',').map((port) => Number.parseInt(port, 10));
  const port = ports[threadId - 1];

  RestAPI.start({ appPort: port });

  // Init Domain Model Layer
  const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';
  const { sequelize } = DomainModel.initModels(config[dbMode]);

  DomainModel.setLogger(logger);
  await sequelize.sync();

  // Init Use Cases Layer
  UseCaseBase.setSequelizeInstance(sequelize);
  UseCaseBase.setNotificatorInstance(notificator);

  logger.info(`Application started in worker ${threadId}`);
  worker.parentPort.on('message', async (message) => {
    if (message.name === 'stop') {
      logger.info(`Graceful shutdown in worker ${threadId}`);
      await RestAPI.stop();
      logger.info('[App] Closing sequelize connections');
      await sequelize.close();
      logger.info('[App] Exit');
      process.exit(0);
    }
  });

  const logError = (err) => {
    logger.error(err.stack);
  };

  process.on('uncaughtException', logError);
  process.on('warning', logError);
  process.on('unhandledRejection', logError);
})();
