/* eslint-disable class-methods-use-this */
const { Exception: X } = require('../../../packages');
const Base = require('../../Base');
const { Admin } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');
const { dumpAdmin } = require('../../utils/dumps');

class AdminsShow extends Base {
  async execute({ id }) {
    try {
      const admin = await Admin.findById(id);

      return { data: dumpAdmin(admin) };
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

AdminsShow.validationRules = {
  id: ['required', 'uuid']
};

module.exports = AdminsShow;
