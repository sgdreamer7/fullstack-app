const chista = require('../../chista');

const SessionsCreate = require('../../../../use-cases/admin/sessions/Create');
const SessionsCheck = require('../../../../use-cases/admin/sessions/Check');

module.exports = {
  create: chista.makeUseCaseRunner(SessionsCreate, (req) => req.body),

  check: async (req, res, next) => {
    const promise = chista.runUseCase(SessionsCheck, {
      params: { token: req.headers.authorization }
    });

    try {
      const adminData = await promise;

      /* eslint no-param-reassign: 0 */
      // eslint-disable-next-line require-atomic-updates
      req.session = {
        context: {
          adminId: adminData.id
        }
      };

      return next();
    } catch (e) {
      return chista.renderPromiseAsJson(req, res, promise);
    }
  }
};
