const { json } = require('micro');
const defaultWrapper = ({ args, argsGetter = 'params' }) => fn => async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    req.body = await json(req);
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

  return await fn.apply({}, returnValues);
};

module.exports = defaultWrapper;
