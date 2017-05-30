const assert = require('assert');
const { isEmpty, validClassMethodNames, getClassMethod } = require('../utils/objectUtils');

const kebabCase = require('lodash.kebabcase');

// hard-coding types for now
const dsTypes = ['mongodb'];
const _ds = {};
const _models = {};
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

exports.registerModel = function (klass) {
  const {
    config,
    schema,
    name
  } = klass;

  const {
    ds
  } = config;
  assert(name, 'Model name not defined.');
  assert(ds, `DS not configured for model: ${name}`);

  isEmpty(schema) && console.warn(`Schema is empty for model: ${name}`);
  console.log('klass', klass);
  _models[name] = klass;
};

/**
 * @param {String} Class - Rest model class
 * @param {Object} [config]
 * @param {String} config.endpoint - Rest endpoint of this class. Defaults to kebab cased class name
 */
exports.registerRestModel = (klass, config) => {
  const { name } = klass;
  const endpoint = config.endpoint || kebabCase(name);

  assert(name, 'Model name not defined.');
  assert(endpoint, `Endpoint not configured for model: ${name}`);
  const methods = {};
  validClassMethodNames(klass).forEach(n => {
    methods[n] = getClassMethod(klass, n);
  });

  _models[name] = {
    name: name,
    endpoint,
    remotes: _remotes[name],
    methods,
    klass
  };
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

exports.getModelsConfig = () => {
  return Object.freeze(_models);
};
