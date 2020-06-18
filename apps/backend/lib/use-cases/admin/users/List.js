const Base = require('../../Base');
const { Op } = require('../../../packages');
const { dumpUser } = require('../../utils/dumps');
const { User } = require('../../../domain-model/models');

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

class AdminUsersList extends Base {
  static async execute({
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    search = '',
    sortedBy = 'createdAt',
    order = 'DESC'
  }) {
    const userFields = ['firstName', 'secondName', 'email'];
    const findQuery = search
      ? { [Op.or]: userFields.map((field) => ({ [field]: { [Op.like]: `%${search}%` } })) }
      : {};

    const dbRequest = {
      where: findQuery,
      order: [[sortedBy, order]],
      limit,
      offset
    };

    // eslint-disable-next-line compat/compat
    const [users, filteredCount, totalCount] = await Promise.all([
      User.findAll(dbRequest),
      User.count({ where: findQuery }),
      User.count()
    ]);

    const data = users.map(dumpUser);

    return {
      data,
      meta: {
        totalCount,
        filteredCount,
        limit,
        offset
      }
    };
  }
}

AdminUsersList.validationRules = {
  search: [{ min_length: 2 }],
  limit: ['positive_integer'],
  offset: ['integer', { min_number: 0 }],
  sortedBy: [{ one_of: ['id', 'firstName', 'secondName', 'email', 'createdAt', 'updatedAt'] }],
  order: [{ one_of: ['ASC', 'DESC'] }]
};

module.exports = AdminUsersList;
