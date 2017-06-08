const assert = require('assert');
const pathM = require('path');
const microRouter = require('microrouter');
const compose = require('micro-compose');
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
    return `${this.method.toUpperCase()} ${this.path}`;
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

exports.createRoutes = (name, endpoint, remotes, methods, app) => {
  // const routes = [];
  console.log(`${name} Routes:`);
  const routeFns = [];
  let composers = app.getComposers();

  for (let [methodName, config] of Object.entries(remotes)) {
    config.app = app;
    const execMethod = methods[methodName];
    assert(execMethod, `Method not found for name: ${methodName}, path: ${config.path}`);

    const fn = compose.apply({}, [...composers, defaultWrapper(config)]);
    const route = new Route(endpoint, methodName, config, fn(execMethod));
    // routes.push(route);
    routeFns.push(route.routeFn());
    console.log(route.toString());
  }
  console.log('');
  return routeFns;
};
