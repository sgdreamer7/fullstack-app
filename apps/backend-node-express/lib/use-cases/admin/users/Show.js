/* eslint-disable class-methods-use-this */
const { Exception: X } = require('../../../packages');
const Base = require('../../Base');
const { dumpUser } = require('../../utils/dumps');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');

class AdminUsersShow extends Base {
  async execute({ id }) {
    try {
      const user = await User.findById(id, { allowBlocked: 1, allowPending: 1 });

      return { data: dumpUser(user) };
    } catch (x) {
      if (x instanceof DMX.WrongId) {
        throw new X({
          code: 'WRONG_ID',
          fields: { [x.field]: 'WRONG_ID' }
        });
      }

      throw x;
    }
  }
}

AdminUsersShow.validationRules = {
  id: ['required', 'uuid']
};

module.exports = AdminUsersShow;
