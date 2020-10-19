/* eslint-disable brace-style */
const consoleLogger = require('../utils/consoleLogger');

// eslint-disable-next-line no-underscore-dangle
let _LOGGER = consoleLogger;

module.exports = {
  setLogger: (logger) => {
    _LOGGER = logger;
  },
  fatal(data) {
    _LOGGER.fatal(data);
  },
  error(data) {
    _LOGGER.error(data);
  },
  warn(data) {
    _LOGGER.warn(data);
  },
  info(data) {
    _LOGGER.info(data);
  },
  debug(data) {
    _LOGGER.debug(data);
  },
  trace(data) {
    _LOGGER.trace(data);
  }
};
