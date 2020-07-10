/* eslint-disable class-methods-use-this */
const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { Admin } = require('../../../domain-model/models');

const { generateToken } = require('../../utils/jwtUtils');

class AdminSessionsCreate extends Base {
  async execute({ data }) {
    const existingAdmin = await Admin.findOne({ where: { email: data.email } });

    if (!existingAdmin || !(await existingAdmin.checkPassword(data.password))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
          password: 'INVALID'
        }
      });
    }

    return {
      data: {
        jwt: generateToken({ id: existingAdmin.id })
      }
    };
  }
}

AdminSessionsCreate.validationRules = {
  data: [
    'required',
    {
      nested_object: {
        password: ['required', 'string'],
        email: ['required', 'string']
      }
    }
  ]
};

module.exports = AdminSessionsCreate;
