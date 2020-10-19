const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { dumpUser } = require('../../utils/dumps');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');

class UsersUpdate extends Base {
  static async execute({ id, data }) {
    try {
      const { firstName, secondName, lang, avatar } = data;
      const { userId } = this.context;

      if (id !== userId) {
        throw new X({
          code: 'PERMISSION_DENIED',
          fields: { token: 'WRONG_TOKEN' }
        });
      }

      const user = await User.findById(id);

      const result = await user.update({
        firstName,
        secondName,
        lang,
        avatar
      });

      return { data: dumpUser(result) };
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

UsersUpdate.validationRules = {
  id: ['required', 'uuid'],
  data: {
    nested_object: {
      firstName: [{ min_length: 2 }, { max_length: 50 }],
      secondName: [{ min_length: 2 }, { max_length: 50 }],
      avatar: [{ min_length: 2 }, { max_length: 150 }],
      lang: { one_of: ['en', 'ru', 'ua'] }
    }
  }
};

module.exports = UsersUpdate;
