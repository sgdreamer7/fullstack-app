const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const chista = require('../chista');

const UsersCreate = require('../../../../use-cases/main/users/Create');
const UsersUpdate = require('../../../../use-cases/main/users/Update');
const UsersResetPassword = require('../../../../use-cases/main/users/ResetPassword');
const UsersList = require('../../../../use-cases/main/users/List');
const UsersShow = require('../../../../use-cases/main/users/Show');
const UsersDelete = require('../../../../use-cases/main/users/Delete');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    secondName: { type: GraphQLString },
    avatarUrl: { type: GraphQLString },
    lang: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
});

const UsersType = new GraphQLList(UserType);

const fields = {
  ...chista.makeUseCaseRunner('create', UsersCreate, UserType, undefined, (args) => args),
  ...chista.makeUseCaseRunner('update', UsersUpdate, UserType, undefined, (args, context) => ({
    ...args,
    id: context.user.id
  })),
  ...chista.makeUseCaseRunner(
    'resetPassword',
    UsersResetPassword,
    UserType,
    undefined,
    (args) => args
  ),
  ...chista.makeUseCaseRunner('list', UsersList, UsersType, undefined, (args) => args),
  ...chista.makeUseCaseRunner('show', UsersShow, UserType, undefined, (args, context) => ({
    id: context.user.id
  })),
  ...chista.makeUseCaseRunner('delete', UsersDelete, UserType, undefined, (args, context) => ({
    ...args,
    id: context.user.id
  }))
};
module.exports = {
  type: new GraphQLObjectType({
    name: 'QueryUsers',
    fields
  }),
  resolve: () => ({})
};
