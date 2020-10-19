const chista = require('../../chista');
const SessionsCreate = require('../../../../use-cases/main/sessions/Create');
const SessionsCheck = require('../../../../use-cases/main/sessions/Check');
const config = require('../../../../config');

module.exports = {
  create: async (req, res) => {
    const promise = chista.runUseCase(SessionsCreate, {
      params: { data: req.body }
    });

    try {
      const sessionData = await promise;

      res.cookie('token', sessionData.data.jwt, {
        expires: new Date(Date.now() + config.cookieExpiration),
        httpOnly: true
      });

      res.send(sessionData.data);
    } catch (e) {
      return chista.renderPromiseAsJson(req, res, promise);
    }
  },

  check: async (req, res, next) => {
    const promise = chista.runUseCase(SessionsCheck, {
      params: { token: (req.cookies && req.cookies.token) || req.headers.authorization }
    });

    try {
      const userData = await promise;

      /* eslint no-param-reassign: 0 */
      // eslint-disable-next-line require-atomic-updates
      req.session = {
        context: {
          userId: userData.id
        }
      };

      return next();
    } catch (e) {
      return chista.renderPromiseAsJson(req, res, promise);
    }
  }
};
