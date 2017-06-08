const UrlPattern = require('url-pattern');
var pattern = new UrlPattern('/items/auth-test');

const auth = (app) => fn => async (req, res) => {
  const isMatched = !!pattern.match(req.url);
  if (isMatched && (!req.headers.authorization || !(req.headers.authorization === app.get('authToken')))) {
    const e = new Error('Unauthenticated');
    e.status = 401;
    throw e;
  }
  return await fn(req, res);
};

module.exports = auth;
