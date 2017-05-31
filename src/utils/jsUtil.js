const fs = require('fs');
const path = require('path');

/**
 * Loads / require js file from specified `dir`.
 * Relative to `rootDir`
 * @param  {String} dir                    Loads all js files from this directory.
 * @param  {String} [rootDir=process.cwd(] Relative to this directory
 */
exports.loadJS = function (dir, rootDir = process.cwd()) {
  const loadedJS = [];
  const loadDir = path.resolve(rootDir, dir);
  if (fs.existsSync(loadDir)) {
    const modelFiles = fs.readdirSync(loadDir);
    modelFiles.forEach(p =>
      p.length - p.lastIndexOf('.js') === 3 && loadedJS.push(require(path.resolve(loadDir, p))));
  }
  return loadedJS;
};
