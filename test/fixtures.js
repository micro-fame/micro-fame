const axios = require('axios');
const { Boot } = require('../src');

exports.initServerCaller = async function () {
  const { address, port, app } = await Boot({ rootDir: __dirname });
  const url = `http://${address}:${port}`;
  const caller = axios.create({
    baseURL: url,
    timeout: 5000
  });
  return { caller, app };
};
