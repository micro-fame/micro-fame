const { Remote } = require('../../src');

class BaseWithoutRest {

  @Remote({
    path: '/remote-base-without-rest'
  })
  remote() {
    return this.getUserService().getName();
  }

  getUserService() {
    const { app: { services: { User } } } = this;
    return User;
  }
};

module.exports = BaseWithoutRest;
