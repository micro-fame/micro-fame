const { json } = require('micro');
const assert = require('assert');

const { env: { REQ_BODY_LIMIT, REQ_BODY_ENCODING } } = process;
const VALID_ARGS_GETTER = ['params', 'query', 'body'];

const defaultWrapper = ({ method, args, argsGetter = 'params', fnArgs }) => {
  assert(VALID_ARGS_GETTER.indexOf(argsGetter) > -1,
    'Invalid argsGetter. Valid values are `params`, `query`, `body`');
  argsGetter === 'body' &&
    assert(method.toLowerCase() === 'post', 'argsGetter === `body`, can be used only with POST.');
  return fn => {
    const hasArgs = !!args;
    return async (req, res) => {
      const isPost = req.method.toLowerCase() === 'post';
      if (isPost) {
        req.body = await json(req, { limit: REQ_BODY_LIMIT, encoding: REQ_BODY_ENCODING });
      }

      const returnValues = [];

      fnArgs.forEach(arg => {
        returnValues.push(hasArgs && args[arg] ? args[arg](req) : req[argsGetter][arg]);
      });

      return await fn(...returnValues);
    };
  };
};

module.exports = defaultWrapper;
