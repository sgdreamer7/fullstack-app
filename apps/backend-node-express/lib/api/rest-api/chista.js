const ChistaModule = require('chista');
const apiLogger = require('../logger');
const { Exception } = require('../../packages');

const getLogger = () => (type, data) => apiLogger[type](data);

// eslint-disable-next-line func-style
let singletonContextBuilder = () => ({});

const setContextBuilder = (fn) => {
  singletonContextBuilder = fn;
};

// eslint-disable-next-line new-cap
const chista = new ChistaModule.default({
  defaultLogger: getLogger(),
  defaultParamsBuilder: (params = {}) => params,
  defaultContextBuilder: () => singletonContextBuilder() || {}
});

chista.makeUseCaseRunner = makeUseCaseRunner;
chista.runUseCase = runUseCase;
chista.setContextBuilder = setContextBuilder;

async function runUseCase(
  useCaseClass,
  { context = {}, params = {}, logger = chista.defaultLogger }
) {
  function logRequest(type, result, startTime) {
    const mapper =
      (process.env.NODE_ENV === 'production' && ((data) => JSON.stringify(data))) ||
      ((data) => data);
    logger(
      type,
      mapper({
        useCase: useCaseClass.name,
        runtime: Date.now() - startTime,
        params,
        result
      })
    );
  }

  const startTime = Date.now();

  try {
    // eslint-disable-next-line new-cap
    const result = await new useCaseClass({ context }).run(params);

    logRequest('info', result, startTime);

    return result;
  } catch (error) {
    const type = error instanceof Exception ? 'warn' : 'error';

    logRequest(type, error, startTime);

    throw error;
  }
}

function makeUseCaseRunner(
  useCaseClass,
  paramsBuilder = chista.defaultParamsBuilder,
  contextBuilder = chista.defaultContextBuilder,
  logger = chista.defaultLogger
) {
  return async function useCaseRunner(req, res) {
    const resultPromise = runUseCase(useCaseClass, {
      params: paramsBuilder(req, res),
      context: contextBuilder(req, res),
      logger
    });

    return renderPromiseAsJson(req, res, resultPromise, logger);
  };
}

async function renderPromiseAsJson(req, res, promise, logger = chista.defaultLogger) {
  try {
    const data = await promise;

    return res.send(data);
  } catch (error) {
    /* istanbul ignore next */
    if (error instanceof Exception) {
      res.send({
        status: 0,
        error: error.toHash()
      });
    } else {
      logger('fatal', {
        REQUEST_URL: req.url,
        REQUEST_PARAMS: req.params,
        REQUEST_BODY: req.body,
        ERROR_STACK: error.stack
      });

      res.send({
        status: 0,
        error: {
          code: 'SERVER_ERROR',
          message: 'Please, contact your system administrator!'
        }
      });
    }
  }
}

module.exports = chista;
