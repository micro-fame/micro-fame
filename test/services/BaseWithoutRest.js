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

  @Remote({
    path: '/get-with-params/:name/:text'
  })
  async getWithParams(name, text) {
    return {
      name,
      text
    };
  }

  @Remote({
    path: '/paramsFromQuery',
    args: {
      text: ({ query: { text } }) => text,
      number: ({ query: { number } }) => number
    }
  })
  async paramsFromQuery(text, number) {
    return { text, number };
  }

  @Remote({
    path: '/argsGetterBody',
    argsGetter: 'body',
    method: 'post'
  })
  async argsGetterBody(name, text) {
    return { text, name };
  }
};

module.exports = BaseWithoutRest;
