const chista = require('../../chista');

const UsersCreate = require('../../../../use-cases/admin/users/Create');
const UsersUpdate = require('../../../../use-cases/admin/users/Update');
const UsersResetPassword = require('../../../../use-cases/admin/users/ResetPassword');
const UsersList = require('../../../../use-cases/admin/users/List');
const UsersShow = require('../../../../use-cases/admin/users/Show');
const UsersDelete = require('../../../../use-cases/admin/users/Delete');

module.exports = {
  create: chista.makeUseCaseRunner(UsersCreate, (req) => req.body),
  update: chista.makeUseCaseRunner(UsersUpdate, (req) => ({ ...req.body, id: req.params.id })),
  resetPassword: chista.makeUseCaseRunner(UsersResetPassword, (req) => ({
    ...req.query,
    ...req.params
  })),
  list: chista.makeUseCaseRunner(UsersList, (req) => ({ ...req.query, ...req.params })),
  show: chista.makeUseCaseRunner(UsersShow, (req) => ({ id: req.params.id })),
  delete: chista.makeUseCaseRunner(UsersDelete, (req) => ({ ...req.body, id: req.params.id }))
};
