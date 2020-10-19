const chista = require('../../chista');
const ActionsSubmit = require('../../../../use-cases/main/actions/Submit');
const config = require('../../../../config');

module.exports = {
  submit: async (req, res) => {
    const promise = chista.runUseCase(ActionsSubmit, {
      params: {
        data: req.body.data || {},
        id: req.params.id
      }
    });

    try {
      const actionData = await promise;

      if (actionData.jwt)
        res.cookie('token', actionData.jwt, {
          expires: new Date(Date.now() + config.cookieExpiration),
          httpOnly: true
        });

      res.send(actionData);
    } catch (e) {
      return chista.renderPromiseAsJson(req, res, promise);
    }
  }
};
