const Boot = require('./lib/Boot');
const RestService = require('./lib/decorators/RestService');
const Remote = require('./lib/decorators/Remote');
const fsUtil = require('./utils/fsUtil');
const jsUtil = require('./utils/jsUtil');
const objectUtil = require('./utils/objectUtil');


exports.Boot = Boot;
exports.RestService = RestService;
exports.Remote = Remote;

exports.Utils = {
  fs: fsUtil,
  js: jsUtil,
  object: objectUtil
};