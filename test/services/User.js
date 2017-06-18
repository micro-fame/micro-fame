const { RestService, Remote } = require('../../src');
const BaseWithoutRest = require('./BaseWithoutRest');
function PostRemote(config) {
  return Remote(Object.assign({}, {
    argsGetter: 'body',
    method: 'post'
  }, config));
}

@RestService({
  endpoint: 'no-user'
})
class User extends BaseWithoutRest {

  @Remote({
    path: '/',
    method: 'get'
  })
  async index() {
    return 'index';
  }

  @Remote({
    path: '/getName',
    method: 'get'
  })
  async getName() {
    return 'hello';
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
    path: '/getOptionalParam(/:text)',
    method: 'get'
  })
  async getOptionalParam(text) {
    return { text: text };
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
    path: '/mixParams/:name',
    method: 'get',
    args: {
      text: ({ query: { text } }) => text,
      number: ({ query: { number } }) => number,
      name: ({ params: { name } }) => name
    }
  })
  async mixParams(name, text, number) {
    return { name, text, number };
  }

  @Remote({
    path: '/mixParams/:name',
    method: 'post',
    args: {
      name: ({ params: { name } }) => name,
      text: ({ query: { text } }) => text,
      number: ({ body: { number } }) => number
    }
  })
  async mixParamsQB(name, text, number) {
    return { name, text, number };
  }

  @Remote({
    path: '/promiseTest/:text',
    method: 'get'
  })
  promiseTest(text) {
    return new Promise((resolve, reject) => {
      resolve(text);
    });
  }

  @Remote({
    path: '/argsGetterQuery',
    argsGetter: 'query'
  })
  async argsGetterQuery(name, text) {
    return { text, name };
  }

  @Remote({
    path: '/argsGetterBody',
    argsGetter: 'body',
    method: 'post'
  })
  async argsGetterBody(name, text) {
    return { text, name };
  }

  @PostRemote({
    path: '/postRecipe'
  })
  async postRecipe(name, text) {
    return { text, name };
  }

};

module.exports = User;
