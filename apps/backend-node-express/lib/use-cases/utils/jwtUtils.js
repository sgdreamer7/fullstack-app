const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
  generateToken: (object) => jwt.sign({ id: object.id }, config.secret),
  verifyToken: (token) => jwt.verify(token, config.secret)
};
