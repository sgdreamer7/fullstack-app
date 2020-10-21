const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLString, GraphQLSchema, GraphQLObjectType } = require('graphql');
const config = require('../../../config');
const chista = require('../chista');
const SessionsCheck = require('../../../use-cases/main/sessions/Check');
const UsersShow = require('../../../use-cases/main/users/Show');
const controllers = require('./controllers/index');

const router = express.Router();
const QueryRootType = new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    users: controllers.users,
    hello: {
      type: GraphQLString,
      args: {
        who: { type: GraphQLString }
      },
      resolve: (_root, args, context) =>
        `Hello ${(args && args.who) || 'World'}\ncontext: ${JSON.stringify(context.user)}`
    },
    thrower: {
      type: GraphQLString,
      resolve() {
        throw new Error('Throws!');
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: QueryRootType
});

async function getUserFromReq(req) {
  const token = (req.cookies && req.cookies.token) || req.headers.authorization;
  if (token) {
    const promise = chista.runUseCase(SessionsCheck, {
      params: { token }
    });

    try {
      const sessionData = await promise;
      const userId = sessionData.id;
      if (userId) {
        const user = await chista.runUseCase(UsersShow, {
          params: { id: userId },
          context: { userId }
        });
        if (user) {
          if (user.isBanned) throw new Error('Looser!');
          return user;
        }
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}

router.use('/', async (req, res) => {
  let user;
  try {
    user = await getUserFromReq(req);
  } catch (e) {
    throw new Error('You provide incorrect token!');
  }
  const hasRole = (role) => {
    if (user && Array.isArray(user.roles)) return user.roles.includes(role);
    return false;
  };
  const setToken = (token) => {
    res.cookie('token', token, {
      expires: new Date(Date.now() + config.cookieExpiration),
      httpOnly: true
    });
  };
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: { req, user, setToken, hasRole }
  })(req, res);
});

module.exports = router;
