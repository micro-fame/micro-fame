const {
  registerModel
} = require('../Registry');

exports.Model = (Class) => {
  console.log('Model Class', Class.config, Class.schema, Class.name);
  registerModel(Class);
};
