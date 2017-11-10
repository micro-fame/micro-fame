const { MongoClient } = require('mongodb');

module.exports = async function (app) {
  const db = await MongoClient.connect('mongodb://127.0.0.1/test', {
    promiseLibrary: require('bluebird'),
    loggerLevel: 'error',
    reconnectInterval: 2000
  });
  console.log('DB connected ' + db.databaseName);
  app.set('db', db);
};
