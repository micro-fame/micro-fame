const { RestModel, Remote } = require('../../src');

function RestrictionByUserName(Class, methodName, descriptor) {
  const callback = descriptor.value;
  return {
    ...descriptor,
    value(userName) {
      if (userName !== 'admin') {
        const e = new Error('Admin is permitted to access.');
        e.status = 403;
        throw e;
      }
      const args = arguments;
      return callback.apply(this, args);
    }
  };
}

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

  @Remote({
    path: '/test-token-params/:text',
    args: {
      token: ({ headers: { authorization } }) => authorization
    }
  })
  async testTokenParams(token, text) {
    return 'passed';
  }

  @RestrictionByUserName
  @Remote({
    path: '/admin-only-route/:userName'
  })
  async adminOnlyRoute(userName) {
    return 'Hi Admin.';
  }

};

module.exports = Items;
