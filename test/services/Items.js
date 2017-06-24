const { RestService, Remote } = require('../../src');

const BaseWithRest = require('./BaseWithRest');
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

@RestService()
class Items extends BaseWithRest {

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
    const total = await this.getTotalItems();
    const superTestVal = await super.remote();
    return {
      appItem: this.app.get('item'),
      total,
      superTestVal
    };
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
    return { text };
  }

  @Remote({
    path: '/test-token-body',
    args: {
      token: ({ headers: { authorization } }) => authorization
    },
    argsGetter: 'body',
    method: 'post'
  })
  async testTokenBody(token, text) {
    return { text };
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
