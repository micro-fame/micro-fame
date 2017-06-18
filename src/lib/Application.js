const assert = require('assert');
const {
  readOnly,
  isEmpty
} = require('../utils/objectUtils');
const { createRoutes, initRouter } = require('./server/routes');

// class having everything. must be init..
const _map = new Map();
const _servicesMap = {};
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
      for (const [name, { endpoint, remotes, instance }] of Object.entries(services)) {
        if (endpoint) {
          _servicesMap[name] = instance;
          instance.app = this;
          routeFns = [...routeFns, ...createRoutes(name, endpoint, remotes, instance, this)];
        }
      }
      this.router = initRouter(routeFns);
      this.services = Object.freeze(_servicesMap);
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
  return Object.freeze(instance);
};
