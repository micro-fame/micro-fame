const {
  registerRemote
} = require('../Registry');

/**
 * Decorator for remoting class methods
 * @param {Object} config
 * @param {String} config.path - remote path
 * @param {String} [config.method=get] - remote HTTP method
 * @param {String} [config.method=get] - remote HTTP method
 * // TODO docs
 */
const Remote = (config) => {
  return (Class, methodName, descriptor) => {
    registerRemote(methodName, config, Class.constructor.name);
    return descriptor;
  };
};

module.exports = Remote;
