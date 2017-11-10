const fs = require('mz/fs');
/**
 * 
 * Checks for directory exists
 * @param {String} path 
 * @returns Boolean
 */
exports.isDirExists = async function (path) {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch (err) {
    return false;
  }
};
