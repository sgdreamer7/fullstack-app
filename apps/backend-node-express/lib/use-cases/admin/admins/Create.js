const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { dumpAdmin } = require('../../utils/dumps');
const { Admin } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');

class AdminsCreate extends Base {
  static async execute({ data }) {
    try {
      const admin = await Admin.create(data);

      return { data: dumpAdmin(admin) };
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

AdminsCreate.validationRules = {
  data: [
    'required',
    {
      nested_object: {
        email: ['required', 'string', { max_length: 255 }, 'to_lc'],
        password: ['required', 'string', { min_length: 6 }, { max_length: 255 }]
      }
    }
  ]
};

module.exports = AdminsCreate;
