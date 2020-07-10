/* eslint-disable class-methods-use-this */
const { Exception: X } = require('../../../packages');
const Base = require('../../Base');
const { User } = require('../../../domain-model/models');
const Action = require('../../../domain-model/StoredTriggerableAction');
const DMX = require('../../../domain-model/X');

class AdminUsersDelete extends Base {
  async execute({ id }) {
    try {
      const user = await User.findById(id, { allowPending: 1, allowBlocked: 1 });

      await user.destroy();
      await Action.destroy({ where: { payload: { '"userId"': id } } });

      return {};
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

AdminUsersDelete.validationRules = {
  id: ['required', 'uuid']
};

module.exports = AdminUsersDelete;
