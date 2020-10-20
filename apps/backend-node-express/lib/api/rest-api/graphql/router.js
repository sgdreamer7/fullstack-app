const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const router = express.Router();

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const root = {
  hello: () => 'Hello world!'
};

router.use('/', (req, res) =>
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
    context: { req, res, token: (req.cookies && req.cookies.token) || req.headers.authorization }
  })(req, res)
);

module.exports = router;
