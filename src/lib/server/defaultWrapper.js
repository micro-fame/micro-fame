const { json } = require('micro');
const { env: { REQ_BODY_LIMIT, REQ_BODY_ENCODING } } = process;

const defaultWrapper = ({ args, argsGetter = 'params', app }) => fn => async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    req.body = await json(req, { limit: REQ_BODY_LIMIT, encoding: REQ_BODY_ENCODING });
  }

  let returnValues = [];
  // TODO strict method args names & count check
  if (args) {
    Object.values(args).forEach(function (fn) {
      returnValues.push(fn(req));
    });
  } else {
    returnValues = Object.values(req[argsGetter]);
  }

  return await fn.apply({ app }, returnValues);
};

module.exports = defaultWrapper;
