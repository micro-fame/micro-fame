const {
  registerRestModel
} = require('../Registry');

/**
 * Inherits all the capabilities of `Model`
 * @param {any} Class - Model class
 */
const RestModel = (config) => {
  return (Class) => {
    registerRestModel(Class, config);
  };
};

module.exports = RestModel;
