const chista = require('../../chista');
const ActionsSubmit = require('../../../../use-cases/main/actions/Submit');

module.exports = {
  submit: chista.makeUseCaseRunner(ActionsSubmit, (req) => ({
    data: req.body.data || {},
    id: req.params.id
  }))
};
