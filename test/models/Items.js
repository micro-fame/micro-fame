const { RestModel, Remote } = require('../../src');

@RestModel()
class Items {

  @Remote({
    path: '/total'
  })
  async getTotalItems() {
    return 100;
  }

  @Remote({
    path: '/app-get-test'
  })
  async appGet() {
    return this.app.get('item');
  }

  @Remote({
    path: '/auth-test',
    args: {
      token: ({ headers: { authorization } }) => authorization
    }
  })
  async authTest(token) {
    return token;
  }

};

module.exports = Items;
