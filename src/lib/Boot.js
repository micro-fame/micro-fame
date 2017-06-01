const assert = require('assert');
const {
  getDSConfig,
  getModelsConfig
} = require('./Registry');

const { loadJS } = require('../utils/jsUtil');

const server = require('./server');

const app = require('./Application');
const ROOT_DIR = process.cwd();

let isInit = false;

/**
 * Loads models from models directory.
 * @param {String} rootDir - Root directory
 */
const loadModels = (rootDir) => {
  const js = loadJS('models', rootDir);
  assert(js.length, `Not found models directory in root directory: ${rootDir}`);
};

/**
 * Booting to app. Must be declared one time only.
 * Boot call must be last.
 * @param {Object} [options={}]
 * @param {Number} [options.port] - Server port
 * @param {String} [options.rootDir = process.cwd()] - Root dir to look models & composers
 */
const Boot = async (options = {}) => {
  assert(!isInit, 'Application already initialized. Multiple Boot calls.');
  isInit = true;
  const rootDir = options.rootDir || ROOT_DIR;
  loadModels(rootDir);
  const ds = getDSConfig();
  const models = getModelsConfig();

  // construct the final config object
  const config = {
    ds,
    models,
    rootDir
  };

  const appInstance = await app(config);
  return server(options, appInstance.router);
};

module.exports = Boot;
