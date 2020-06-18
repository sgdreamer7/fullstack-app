const { UseCaseBase: ChistaUseCaseBase } = require('../packages');

require('./registerValidationRules');

class UseCaseBase extends ChistaUseCaseBase {
  constructor(...params) {
    super(...params);

    this.notificator = UseCaseBase.notificatorInstance;
  }

  static setSequelizeInstance(sequelize) {
    UseCaseBase.sequelizeInstance = sequelize;
  }

  static setNotificatorInstance(notificator) {
    UseCaseBase.notificatorInstance = notificator;
  }

  run(...args) {
    if (!UseCaseBase.sequelizeInstance) /* c8 ignore next */ return super.run(...args);

    const run = super.run.bind(this);
    const transaction = global.testTransaction /* c8 ignore next */ || null;

    return UseCaseBase.sequelizeInstance.transaction({ transaction }, () => run(...args));
  }
}

UseCaseBase.sequelizeInstance = null;

UseCaseBase.notificatorInstance = {
  notify: () => {
    if (process.env.MODE === 'test') return;
    throw new Error('notificatorInstance is not set');
  }
};

module.exports = UseCaseBase;
