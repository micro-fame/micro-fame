const {
  registerBootFns
} = require('../Registry');

exports.BootFn = (config) => {
  registerBootFns();
  return (Class) => {};
};

exports.BootFnAsync = (config) => {
  registerBootFns();
  return (Class) => {};
};
