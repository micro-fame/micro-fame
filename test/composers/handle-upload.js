const formidable = require('formidable');
const Promise = require('bluebird');

function parseForm(req, options) {
  return new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm();
    Object.assign(form, options);
    form.parse(req, function (err, fields, files) {
      if (err) {
        console.log('err', err);
        reject(err);
      } else {
        Object.assign(req, {
          fields,
          files
        });
        resolve();
      }
    });
  });
};

const upload = (app) => fn => async (req, res) => {
  if (req.url === '/upload/item' && req.method.toLowerCase() === 'post') {
    await parseForm(req);
  }
  return await fn(req, res);
};

module.exports = upload;
