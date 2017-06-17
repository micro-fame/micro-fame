const {
  registerRestService
} = require('../Registry');

/**
 * @param {any} Class - Service class
 */
const RestService = (config) => {
  return (Class) => {
    registerRestService(Class, config);
  };
};

module.exports = RestService;
