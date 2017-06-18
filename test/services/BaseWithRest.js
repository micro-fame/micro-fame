const { Remote, RestService } = require('../../src');

@RestService({
  endpoint: 'rest-base'
})
class BaseWithRest {

  @Remote({
    path: '/remote-base-with-rest'
  })
  remote() {
    return this.getUserService().getName();
  }

  getUserService() {
    const { app: { services: { User } } } = this;
    return User;
  }

};

module.exports = BaseWithRest;
