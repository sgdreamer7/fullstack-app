const chista = require('../../chista');

const AdminsCreate = require('../../../../use-cases/admin/admins/Create');
const AdminsResetPassword = require('../../../../use-cases/admin/admins/ResetPassword');
const AdminsList = require('../../../../use-cases/admin/admins/List');
const AdminsShow = require('../../../../use-cases/admin/admins/Show');
const AdminsDelete = require('../../../../use-cases/admin/admins/Delete');

module.exports = {
  create: chista.makeUseCaseRunner(AdminsCreate, (req) => req.body),
  resetPassword: chista.makeUseCaseRunner(AdminsResetPassword, (req) => ({
    ...req.body,
    id: req.params.id
  })),
  list: chista.makeUseCaseRunner(AdminsList, (req) => ({ ...req.query, ...req.params })),
  show: chista.makeUseCaseRunner(AdminsShow, (req) => ({ id: req.params.id })),
  delete: chista.makeUseCaseRunner(AdminsDelete, (req) => ({ ...req.body, id: req.params.id }))
};
