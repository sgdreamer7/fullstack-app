const pino = require('pino');
const clsNamespace = require('../clsNamespace');

const options = {
  prettyPrint: !process.env.NODE_ENV === 'production',
  redact: {
    paths: [
      'msg.*.data.password',
      'msg.*.data.confirmPassword',
      'msg.*.password',
      'msg.*.confirmPassword',
      'msg.params.token',
      'msg.result.data.jwt',
      'msg.result.jwt'
    ],
    censor: '**SENSITIVE DATA**'
  }
  // level : 30
};

class Logger {
  constructor() {
    this.logger = pino(options);

    this.generateWrappedMethods();
  }

  generateWrappedMethods() {
    const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

    // eslint-disable-next-line no-restricted-syntax
    for (const method of methods) {
      this[method] = (...args) => {
        const traceID = clsNamespace.get('traceID');
        if (traceID) {
          this.logger[method]({ traceID }, ...args);
        } else {
          this.logger[method](...args);
        }
      };
    }
  }
}

module.exports = Logger;
