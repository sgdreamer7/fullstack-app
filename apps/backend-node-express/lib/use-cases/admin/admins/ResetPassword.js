const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { Admin } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');
const StoredTriggerableAction = require('../../../domain-model/StoredTriggerableAction');

const { TYPES: ActionTypes } = StoredTriggerableAction;

class AdminsResetPassword extends Base {
  async execute({ id }) {
    try {
      const action = await StoredTriggerableAction.create({
        type: ActionTypes.RESET_ADMIN_PASSWORD,
        payload: { adminId: id }
      });

      const admin = await Admin.findById(id);

      await this.notificator.notify('RESET_PASSWORD', admin.email, {
        ...admin,
        actionId: action.id
      });

      return {};
    } catch (x) {
      if (x instanceof DMX.WrongId) {
        throw new X({
          code: 'WRONG_ID',
          fields: { id: 'WRONG_ID' }
        });
      }

      throw x;
    }
  }
}

AdminsResetPassword.validationRules = {
  id: ['required', 'uuid']
};

module.exports = AdminsResetPassword;
