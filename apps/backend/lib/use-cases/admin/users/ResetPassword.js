const { Exception: X } = require('../../../packages');
const Base = require('../../Base');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');
const StoredTriggerableAction = require('../../../domain-model/StoredTriggerableAction');

const { TYPES: ActionTypes } = StoredTriggerableAction;

class AdminUsersResetPassword extends Base {
  static async execute({ id }) {
    try {
      const action = await StoredTriggerableAction.create({
        type: ActionTypes.RESET_USER_PASSWORD,
        payload: { userId: id }
      });

      const user = await User.findById(id, { allowPending: 1 });

      await this.notificator.notify('RESET_PASSWORD', user.email, {
        ...user,
        actionId: action.id
      });

      return {};
    } catch (x) {
      if (x instanceof DMX.WrongId) {
        throw new X({
          code: 'USER_NOT_FOUND',
          fields: { id: 'USER_NOT_FOUND' }
        });
      }

      if (x instanceof DMX.InactiveObject) {
        throw new X({
          code: 'USER_IS_BLOCKED',
          fields: { id: 'USER_IS_BLOCKED' }
        });
      }

      throw x;
    }
  }
}

AdminUsersResetPassword.validationRules = {
  id: ['required', 'uuid']
};

module.exports = AdminUsersResetPassword;
