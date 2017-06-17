const assert = require('assert');
const {
  getDSConfig,
  getServicesConfig
} = require('./Registry');

const { loadJS } = require('../utils/jsUtil');

const server = require('./server');

const app = require('./Application');
const ROOT_DIR = process.cwd();

let isInit = false;

/**
 * Loads services from services directory.
 * @param {String} rootDir - Root directory
 */
const loadServices = (rootDir) => {
  const js = loadJS('services', rootDir);
  assert(js.length, `Not found services directory in root directory: ${rootDir}`);
};

/**
 * Loads compose functions from composers directory
 * @param {String} rootDir - Root directory
 */
const loadComposers = (rootDir) => {
  const js = loadJS('composers', rootDir);
  return js;
};

/**
 * Booting to app. Must be declared one time only.
 * Boot call must be last.
 * @param {Object} [options={}]
 * @param {Number} [options.port] - Server port
 * @param {String} [options.rootDir = process.cwd()] - Root dir to look services & composers
 */
const Boot = async (options = {}) => {
  assert(!isInit, 'Application already initialized. Multiple Boot calls.');
  isInit = true;
  const rootDir = options.rootDir || ROOT_DIR;
  loadServices(rootDir);
  const composers = loadComposers(rootDir);
  const ds = getDSConfig();
  const services = getServicesConfig();

  // construct the final config object
  const config = {
    ds,
    services,
    rootDir,
    composers
  };

  const appInstance = await app(config);
  return Object.assign({ app: appInstance }, await server(options, appInstance.router));
};

module.exports = Boot;
