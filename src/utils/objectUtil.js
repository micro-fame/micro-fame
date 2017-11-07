/**
 * Enforce obj prop to be readonly
 * @param  {Object} obj
 * @param  {String} prop  Property to be defined in obj
 * @param  {*} value Value of prop
 */

exports.readOnly = (obj, prop, value) => {
  Object.defineProperty(obj, prop, {
    value,
    writable: false,
    configurable: false,
    enumerable: false
  });
};

/**
 * Check for object is empty
 * If obj is undefined or null then returns false.
 * @param  {Object}  obj
 * @return {Boolean}    True if obj has no keys;
 */
exports.isEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0;
};

const ignoreMethods = { constructor: true };

/**
 * Return class method names except constructor
 * @param {Class} klass - JS Class
 * @returns {Array} - class method names
 */
exports.validClassMethodNames =
  (klass) => Object.getOwnPropertyNames(klass.prototype).filter((name) => !ignoreMethods[name]);

/**
 * @param {Class} klass  - JS Class
 * @param {any} methodName - Class method name
 * @returns {Function} - Function for the class method
 */
exports.getClassMethod = (klass, methodName) => Object.getOwnPropertyDescriptor(klass.prototype, methodName).value;
