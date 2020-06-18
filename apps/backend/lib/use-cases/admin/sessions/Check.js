const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { Admin } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');

const { verifyToken } = require('../../utils/jwtUtils');

class AdminSessionsCheck extends Base {
  static async execute({ token }) {
    try {
      const adminData = await verifyToken(token);

      await Admin.findById(adminData.id);

      return adminData;
    } catch (x) {
      if (x instanceof DMX.WrongId) {
        throw new X({
          code: 'WRONG_TOKEN',
          fields: { token: 'WRONG_ID' }
        });
      }

      throw new X({
        code: 'WRONG_TOKEN',
        fields: { token: 'WRONG_TOKEN' }
      });
    }
  }
}

AdminSessionsCheck.validationRules = {
  token: ['required', 'string']
};

module.exports = AdminSessionsCheck;
