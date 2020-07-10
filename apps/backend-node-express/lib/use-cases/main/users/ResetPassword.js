const { Exception: X } = require('../../../packages');
const Base = require('../../Base');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');
const StoredTriggerableAction = require('../../../domain-model/StoredTriggerableAction');

const { TYPES: ActionTypes } = StoredTriggerableAction;

class UsersResetPassword extends Base {
  async execute({ data }) {
    try {
      const user = await User.findOne({ where: { email: data.email } });

      if (!user) {
        throw new X({
          code: 'USER_NOT_FOUND',
          fields: { email: 'USER_NOT_FOUND' }
        });
      }

      const action = await StoredTriggerableAction.create({
        type: ActionTypes.RESET_USER_PASSWORD,
        payload: {
          userId: user.id
        }
      });

      await this.notificator.notify('RESET_PASSWORD', user.email, {
        ...user,
        actionId: action.id
      });

      return {};
    } catch (x) {
      if (x instanceof DMX.InactiveObject) {
        throw new X({
          code: 'USER_IS_BLOCKED',
          fields: { email: 'USER_IS_BLOCKED' }
        });
      }

      throw x;
    }
  }
}

UsersResetPassword.validationRules = {
  data: {
    nested_object: {
      email: ['required', 'email']
    }
  }
};

module.exports = UsersResetPassword;
