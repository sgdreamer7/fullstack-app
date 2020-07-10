/* eslint-disable no-underscore-dangle */
const _Sequelize = require('sequelize');
const _bluebird = require('bluebird');
const _docopt = require('docopt');
const _ServiceBase = require('chista/ServiceBase.js');
const _Exception = require('chista/Exception.js');

module.exports = {
  UseCaseBase: _ServiceBase.default,
  Exception: _Exception.default,
  DataTypes: _Sequelize.DataTypes,
  Op: _Sequelize.Op,
  promisifyAll: _bluebird.promisifyAll,
  promisify: _bluebird.promisify,
  docopt: _docopt.docopt
};
