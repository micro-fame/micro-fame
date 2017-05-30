const mongoose = require('mongoose');
const Promise = require('bluebird');
const Datasource = require('./Datasource');
const {
  readOnly
} = require('../utils/objectUtils');

mongoose.Promise = Promise;

class MongoDBDatasource extends Datasource {
  constructor({
    name,
    type,
    url
  }) {
    super(name, type);
    readOnly(this, 'mongodbURL', url);
  }

  promiseExecuter(resolve, reject) {
    const db = mongoose.createConnection(this.mongodbURL);
    readOnly(this, db, db);

    // When successfully connected
    db.on('connected', () => {
      this.onConnect();
      resolve();
    });

    // If the connection throws an error
    db.on('error', () => {
      this.onError();
      resolve();
    });

    // When the connection is disconnected
    db.on('disconnected', this.onDisconnect.bind(this));
  }

  connect() {
    return new Promise(this.promiseExecuter.bind(this));
  }

  close() {
    this.db.close(this.afterClose);
  }

  connection() {
    return this.db;
  }
};

module.exports = MongoDBDatasource;
