const ChistaModule = require('chista');
const apiLogger = require('../../logger');
const { Exception } = require('../../../packages');

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
  name,
  useCaseClass,
  type,
  args,
  paramsBuilder = chista.defaultParamsBuilder,
  contextBuilder = chista.defaultContextBuilder,
  logger = chista.defaultLogger
) {
  return {
    [name]: {
      type,
      ...((args && { args }) || {}),
      resolve(_root, passedArgs, context) {
        const resultPromise = runUseCase(useCaseClass, {
          params: paramsBuilder(passedArgs, context),
          context: contextBuilder(passedArgs, context),
          logger
        });
        return renderPromiseAsJson(args, context, resultPromise, logger);
      }
    }
  };
}

async function renderPromiseAsJson(args, context, promise, logger = chista.defaultLogger) {
  try {
    const data = await promise;

    return data.data || data;
  } catch (error) {
    /* istanbul ignore next */
    if (!(error instanceof Exception)) {
      logger('fatal', {
        ARGS: args,
        CONTEXT: context,
        ERROR_STACK: error.stack
      });
    }
    throw error;
  }
}

module.exports = chista;
