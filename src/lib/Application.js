const assert = require('assert');
const {
  readOnly,
  isEmpty
} = require('../utils/objectUtils');
const { createRoutes, initRouter } = require('./server/routes');

// class having everything. must be init..

const _ds = {};
const _map = new Map();
class Application {
  constructor(config) {
    readOnly(this, 'config', config);
  }

  set(key, value) {
    _map.set(key, value);
  }

  get(key) {
    return _map.get(key);
  }

  getComposers() {
    const arr = [];
    this.config.composers.forEach((cFn) => {
      if (typeof (cFn) === 'function') {
        cFn && arr.push(cFn(this));
      }
    });
    return arr;
  }

  /**
   * @param {any} Services
   * @memberof Application
   */
  bindServices(services) {
    if (!isEmpty(services)) {
      let routeFns = [];
      for (const [name, { endpoint, remotes, methods }] of Object.entries(services)) {
        if (endpoint) {
          routeFns = [...routeFns, ...createRoutes(name, endpoint, remotes, methods, this)];
        }
      }
      this.router = initRouter(routeFns);
    }
  }
};

let isInit = false;
let instance;

const initApp = async (config) => {
  isInit = true;
  instance = new Application(config);

  const {
    services
  } = config;

  instance.bindServices(services);
};

module.exports = async (config) => {
  assert(!isInit, 'app already initialized.');
  !isInit && await initApp(config);
  return instance;
};
