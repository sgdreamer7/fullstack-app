/* eslint-disable class-methods-use-this */
const { Exception: X } = require('../../../packages');
const Base = require('../../Base');
const { Admin } = require('../../../domain-model/models');
const Action = require('../../../domain-model/StoredTriggerableAction');
const DMX = require('../../../domain-model/X');

class AdminsDelete extends Base {
  async execute({ id }) {
    try {
      const admin = await Admin.findById(id);

      await admin.destroy();
      await Action.destroy({ where: { payload: { '"adminId"': id } } });

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

AdminsDelete.validationRules = {
  id: ['required', 'uuid']
};

module.exports = AdminsDelete;
