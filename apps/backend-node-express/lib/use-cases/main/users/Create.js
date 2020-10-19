const { Exception: X } = require('../../../packages');

const Base = require('../../Base');
const { dumpUser } = require('../../utils/dumps');
const { User } = require('../../../domain-model/models');
const DMX = require('../../../domain-model/X');
const StoredTriggerableAction = require('../../../domain-model/StoredTriggerableAction');

const { TYPES: ActionTypes } = StoredTriggerableAction;

class UsersCreate extends Base {
  async execute({ data }) {
    try {
      const user = await User.create(data);

      const action = await StoredTriggerableAction.create({
        type: ActionTypes.ACTIVATE_USER,
        payload: { userId: user.id }
      });

      try {
        await this.notificator.notify('ACTIVATE_USER', data.email, {
          ...dumpUser(user),
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

UsersCreate.validationRules = {
  data: [
    'required',
    {
      nested_object: {
        email: ['required', 'email', { max_length: 255 }, 'to_lc'],
        password: ['required', 'string'],
        confirmPassword: ['required', { equal_to_field: ['password'] }],
        lang: ['string', { max_length: 10 }],
        agreeWithTerms: ['required', { is: true }]
      }
    }
  ]
};

module.exports = UsersCreate;
