const {
  registerDS
} = require('../Registry');

const DataSource = (config) => {
  registerDS(config);
  return (Class) => Class;
};

module.exports = DataSource;

