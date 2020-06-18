/* eslint-disable class-methods-use-this */
const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { User } = require('../../../domain-model/models');

const { generateToken } = require('../../utils/jwtUtils');

class SessionsCreate extends Base {
  async execute({ data }) {
    const existingUser = await User.findOne({ where: { email: data.email } });

    if (!existingUser || !(await existingUser.checkPassword(data.password))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
          password: 'INVALID'
        }
      });
    }

    if (existingUser.status !== 'ACTIVE') {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          status: 'NOT_ACTIVE_USER'
        }
      });
    }

    return {
      data: {
        jwt: generateToken({ id: existingUser.id })
      }
    };
  }
}

SessionsCreate.validationRules = {
  data: [
    'required',
    {
      nested_object: {
        password: ['required', 'string'],
        email: ['required', 'email']
      }
    }
  ]
};

module.exports = SessionsCreate;
