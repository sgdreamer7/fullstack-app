const { Exception: X } = require('../../../packages');
const Base = require('../../Base');
const { dumpUser } = require('../../utils/dumps');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');

class UsersShow extends Base {
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

UsersShow.validationRules = {
  id: ['required', 'uuid']
};

module.exports = UsersShow;
