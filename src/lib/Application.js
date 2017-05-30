const assert = require('assert');
// let createModel;
let MongoDBDataSource;
const {
  readOnly,
  isEmpty
} = require('../utils/objectUtils');
const { createRoutes } = require('./server/routes');

// class having everything. must be init..

const _ds = {};

class Application {
  constructor(config) {
    readOnly(this, 'config', config);
  }

  /**
   * Not working. Needs restructuring.
   * @param {any} ds
   * @memberof Application
   */
  async initDS(ds) {
    if (!isEmpty(ds)) {
      MongoDBDataSource = require('./MongoDBDataSource');
      for (var [name, config] of Object.entries(ds)) {
        // TODO: connect multiple ds parallel
        if (config.type === 'mongodb') {
          const ds = new MongoDBDataSource(config);
          await ds.connect();
          _ds[name] = ds;
        }
      }
    }
  }

  createRoutes(name, endpoint, remotes, methods) {
    this.router = createRoutes(name, endpoint, remotes, methods);
  }

  /**
   * Not working. Needs restructuring.
   * @param {any} models
   * @memberof Application
   */
  bindModels(models) {
    if (!isEmpty(models)) {
      for (let [name, { endpoint, remotes, methods }] of Object.entries(models)) {
        if (endpoint) {
          this.createRoutes(name, endpoint, remotes, methods);
        }
      }
    }
  }
};

let isInit = false;
let instance;

const initApp = async (config) => {
  isInit = true;
  instance = new Application(config);

  const {
    ds,
    models
  } = config;

  await instance.initDS(ds);
  instance.bindModels(models);
};

module.exports = async (config) => {
  assert(!isInit, 'app already initialized.');
  !isInit && await initApp(config);
  return instance;
};
