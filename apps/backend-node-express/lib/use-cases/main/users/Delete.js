const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const Action = require('../../../domain-model/StoredTriggerableAction');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');

class UsersDelete extends Base {
  async execute({ id }) {
    try {
      const { userId } = this.context;

      if (id !== userId) {
        throw new X({
          code: 'PERMISSION_DENIED',
          fields: { token: 'WRONG_TOKEN' }
        });
      }

      const user = await User.findById(id);

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

UsersDelete.validationRules = {
  id: ['required', 'uuid']
};

module.exports = UsersDelete;
