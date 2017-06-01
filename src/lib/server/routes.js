const assert = require('assert');
const pathM = require('path');
const microRouter = require('microrouter');
const { router, get, post } = microRouter;

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const defaultWrapper = require('./defaultWrapper');

class Route {
  constructor(endpoint, methodName, { path, method = 'get' }, execMethod) {
    assert(path, `Path not exists for method: ${methodName}`);
    this.path = pathM.normalize(`/${endpoint}/${path}`);

    assert(METHODS.indexOf(method.toUpperCase()) > -1, 'Invalid HTTP method name.');
    method = method.toLowerCase();
    this.method = method === 'delete' ? 'del' : method;
    this.execMethod = execMethod;
  }

  routeFn() {
    return microRouter[this.method](this.path, this.execMethod);
  }

  toString() {
    return `${this.method.toUpperCase()} ${this.path}`
  }
}

const notfound = (req, res) => {
  const e = new Error(`${req.method} ${req.url} not found`);
  e.status = 404;
  throw e;
};

exports.initRouter = (routeFns) => {
  routeFns.push(get('/*', notfound));
  routeFns.push(post('/*', notfound));
  return router.apply({}, routeFns);
};

exports.createRoutes = (name, endpoint, remotes, methods) => {
  // const routes = [];
  console.log(`${name} Routes:`);
  const routeFns = [];
  for (let [methodName, config] of Object.entries(remotes)) {
    const execMethod = methods[methodName];
    assert(execMethod, `Method not found for name: ${methodName}, path: ${config.path}`);
    const route = new Route(endpoint, methodName, config, defaultWrapper(config)(execMethod));
    // routes.push(route);
    routeFns.push(route.routeFn());
    console.log(route.toString());
  }
  console.log('');
  return routeFns;
};
