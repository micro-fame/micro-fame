const fs = require('mz/fs');
const path = require('path');
const { isDirExists } = require('./fsUtil');

/**
 * Loads / require js file from specified `dir`.
 * Relative to `rootDir`
 * @param  {String} dir                    Loads all js files from this directory.
 * @param  {String} [rootDir=process.cwd(] Relative to this directory
 */
exports.loadJS = async function (dir, rootDir = process.cwd()) {
  const loadedJS = [];
  const loadDir = path.resolve(rootDir, dir);
  if (await isDirExists(loadDir)) {
    const files = await fs.readdir(loadDir);
    for (const p of files) {
      p.length - p.lastIndexOf('.js') === 3 && loadedJS.push(require(path.resolve(loadDir, p)));
    }
  }
  return loadedJS;
};

/**
 * Executes the js files from the `dir` while passing `args` as arguments.
 * 
 * @param {String} dir                  Exec all js from this dir 
 * @param {Array} args                  Pass this as arguments while calling executing the js 
 * @param {any} [rootDir=process.cwd()] Relative to this directory
 */
exports.execJS = async function (dir, args, rootDir = process.cwd()) {
  const loadDir = path.resolve(rootDir, dir);
  if (await isDirExists(loadDir)) {
    const files = await fs.readdir(loadDir);
    for (const p of files) {
      console.log(p);
      if (p.length - p.lastIndexOf('.js') === 3) {
        await require(path.resolve(loadDir, p)).apply(null, args);
      }
    }
  }
};
