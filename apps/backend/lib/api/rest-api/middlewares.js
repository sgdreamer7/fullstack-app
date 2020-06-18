/* eslint-disable no-underscore-dangle */
const cors = require('cors');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const uuid = require('uuid');

const clsNamespace = require('../../clsNamespace');

const logger = require('../logger');

module.exports = {
  clsMiddleware: (req, res, next) => {
    clsNamespace.bind(req);
    clsNamespace.bind(res);

    const traceID = uuid.v4();

    clsNamespace.run(() => {
      clsNamespace.set('traceID', traceID);

      logger.info({
        // url    : req.url,
        pathname: req._parsedUrl.pathname,
        method: req.method,
        // body   : inspect(req.body, { showHidden: false, depth: null })
        body: req.body,
        query: req.query
      });

      next();
    });
  },
  json: bodyParser.json({
    limit: 1024 * 1024,
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.send({
          status: 0,
          error: {
            code: 'BROKEN_JSON',
            message: 'Please, verify your json'
          }
        });
        throw new Error('BROKEN_JSON');
      }
    }
  }),
  urlencoded: bodyParser.urlencoded({ extended: true }),
  cors: cors({ origin: '*' }), // We allow any origin because we DO NOT USE cookies and basic auth
  include: (req, res, next) => {
    const { query } = req;

    if (query.include) {
      query.include = query.include.split(',');
    }

    return next();
  },
  busboy: busboy()
};
