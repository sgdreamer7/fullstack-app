const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { dumpUser } = require('../../utils/dumps');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');
const StoredTriggerableAction = require('../../../domain-model/StoredTriggerableAction');

const { TYPES: ActionTypes } = StoredTriggerableAction;

class AdminUsersCreate extends Base {
  async execute({ data }) {
    try {
      const user = await User.create({
        agreeWithTerms: true,
        ...data
      });

      const action = await StoredTriggerableAction.create({
        type: ActionTypes.ACTIVATE_USER,
        payload: { userId: user.id }
      });

      try {
        await this.notificator.notify('ACTIVATE_USER', data.email, {
          ...user,
          actionId: action.id
        });
      } catch (err) {} // eslint-disable-line no-trailing-spaces, no-empty

      return { data: dumpUser(user) };
    } catch (x) {
      if (x instanceof DMX.NotUnique) {
        throw new X({
          code: 'NOT_UNIQUE',
          fields: { [x.field]: 'NOT_UNIQUE' }
        });
      }

      throw x;
    }
  }
}

AdminUsersCreate.validationRules = {
  data: [
    'required',
    {
      nested_object: {
        email: ['required', 'email', { max_length: 255 }, 'to_lc'],
        password: ['required', 'string', { min_length: 6 }, { max_length: 255 }]
      }
    }
  ]
};

module.exports = AdminUsersCreate;
