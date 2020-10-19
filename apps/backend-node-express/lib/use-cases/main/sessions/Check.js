/* eslint-disable class-methods-use-this */
const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');

const { verifyToken } = require('../../utils/jwtUtils');

class SessionsCheck extends Base {
  async execute({ token }) {
    try {
      const userData = await verifyToken(token);
      const user = await User.findById(userData.id);

      if (user.status !== 'ACTIVE') throw new Error('USER_NOT_ACTIVE');

      return userData;
    } catch (x) {
      if (x instanceof DMX.WrongId) {
        throw new X({
          code: 'WRONG_TOKEN',
          fields: { token: 'WRONG_ID' }
        });
      }

      if (x instanceof DMX.InactiveObject) {
        throw new X({
          code: 'WRONG_TOKEN',
          fields: { token: 'USER_NOT_ACTIVE' }
        });
      }

      throw new X({
        code: 'WRONG_TOKEN',
        fields: { token: 'WRONG_TOKEN' }
      });
    }
  }
}

SessionsCheck.validationRules = {
  token: ['required', 'string']
};

module.exports = SessionsCheck;
