const assert = require('assert');
const kebabCase = require('lodash.kebabcase');

// hard-coding types for now
const dsTypes = ['mongodb'];
const _ds = {};
const _services = {};
const _remotes = {};

exports.registerDS = function (config) {
  const {
    name,
    type
  } = config;
  assert(name, 'Error in DS name.');
  assert(type, 'Error in DS type.');

  assert(dsTypes.includes(type), 'Invalid DS type.');
  assert(!Object.keys(_ds).includes(name), `DS name already used. ${name}`);

  _ds[name] = config;
  console.log('Registry registerDS', _ds);
};

/**
 * @param {String} Class - Rest service class
 * @param {Object} [config]
 * @param {String} config.endpoint - Rest endpoint of this class. Defaults to kebab cased class name
 */
exports.registerRestService = (Class, config = {}) => {
  const { name } = Class;
  const endpoint = config.endpoint || kebabCase(name);

  assert(name, 'Rest service name not defined.');
  assert(endpoint, `Endpoint not configured for service: ${name}`);

  _services[name] = {
    name,
    endpoint,
    remotes: _remotes[name],
    instance: new Class(),
    parentClassName: Object.getPrototypeOf(Class).name
  };
};

/**
 * Function will check all the loaded services and bind parent's route.
 */
exports.bindParentRoutes = () => {
  for (const [name, { parentClassName, remotes }] of Object.entries(_services)) {
    // bind parent remotes
    if (parentClassName) {
      const parentRemotes = _remotes[parentClassName] || [];
      _services[name].remotes = Object.assign({}, parentRemotes, remotes);
    }
  }
};

exports.registerRemote = (methodName, config, className) => {
  assert(config, `config not defined for method: ${methodName} of Class: ${className}`);
  assert(config.path, `path not defined for remote method: ${methodName} of Class: ${className}`);
  if (!_remotes[className]) {
    _remotes[className] = {};
  }
  _remotes[className][methodName] = config;
};

exports.getDSConfig = () => {
  return _ds;
};

exports.getServicesConfig = () => {
  return Object.freeze(_services);
};
