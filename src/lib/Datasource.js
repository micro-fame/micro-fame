// Datasource class.
// Currently for mongodb using moongoose

const {
  readOnly
} = require('../utils/objectUtils');

class Datasource {
  constructor(name, type) {
    readOnly(this, 'name', name);
    readOnly(this, 'type', type);

    // const promise = new Promise(this.promiseExecuter);
    // readOnly(this, 'promise', promise);
  }

  onError() {
    console.error(`Unable to connect to datasource: ${this.name}`);
  }

  onConnect() {
    console.log(`DS ${this.name} - ${this.type} connected`);
  }

  onDisconnect() {
    console.log(`DS ${this.name} - ${this.type} disconnected`);
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  connect() {
    throw new Error('Method not implemented');
  }

  close() {
    throw new Error('Method not implemented');
  }

  connection() {
    throw new Error('Method not implemented');
  }

  afterClose() {
    console.log(`DS ${this.name} - ${this.type} closed`);
  }

  afterConnect() {
    return new Promise((resolve, reject) => {

    });
  }

};

module.exports = Datasource;
