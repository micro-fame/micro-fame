const assert = require('assert');
const { getDSConfig, getServicesConfig, bindParentRoutes } = require('./Registry');

const { loadJS, execJS } = require('../utils/jsUtil');

const server = require('./server');

const app = require('./Application');
const ROOT_DIR = process.cwd();

let isInit = false;

/**
 * Loads services from services directory.
 * @param {String} rootDir - Root directory
 */
const loadServices = async (rootDir) => {
  const js = await loadJS('services', rootDir);
  assert(js.length, `Not found services directory in root directory: ${rootDir}`);
};

/**
 * Loads compose functions from composers directory
 * @param {String} rootDir - Root directory
 */
const loadComposers = async (rootDir) => {
  const js = await loadJS('composers', rootDir);
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
  await loadServices(rootDir);
  bindParentRoutes();
  const composers = await loadComposers(rootDir);
  const ds = getDSConfig();
  const services = getServicesConfig();

  // construct the final config object
  const config = { ds, services, rootDir, composers };

  const appInstance = await app(config);
  await execJS('bootFns', [appInstance], rootDir);
  return Object.assign({ app: appInstance }, await server(options, appInstance.router));
};

module.exports = Boot;
