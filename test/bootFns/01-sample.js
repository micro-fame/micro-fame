const sleep = require('then-sleep');
module.exports = async function (app) {
  console.log('starting sample.js');
  await sleep(1000);
  console.log('end sample js');
};
