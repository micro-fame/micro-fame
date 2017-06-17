const micro = require('micro');
const Promise = require('bluebird');
const { PORT } = process.env;

module.exports = ({ port = PORT || 0 }, router) => {
  return new Promise((resolve, reject) => {
    const server = micro(router);
    server.listen(port, () => {
      const serverAddress = server.address();

      const { family, port } = serverAddress;
      let { address } = serverAddress;

      if (family === 'IPv6' && address === '::') {
        address = '0.0.0.0';
      }
      console.log(`Listening to ${address}:${port}`);
      resolve({ address, port });
    });

    server.on('error', err => {
      console.error('micro:', err.stack);
      reject(err);
      // process.exit(1);
    });
  });
};
