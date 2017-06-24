import test from 'ava';
import path from 'path';
import { initServerCaller } from './fixtures';

const OK = 'OK';

let caller;

test.before(async t => {
  const init = await initServerCaller();
  const app = init.app;
  caller = init.caller;
  app.set('item', 'test');
  app.set('authToken', 'some-token');
});

test('index', async t => {
  const { statusText, data } = await caller.get(path.normalize('/no-user/'));
  t.is(statusText, OK);
  t.is(data, 'index');
});

test('get test', async t => {
  const { statusText, data } = await caller.get('/no-user/getName');
  t.is(statusText, OK);
  t.is(data, 'hello');
});

test('get with params', async t => {
  const { statusText, data } = await caller.get('/no-user/get-with-params/Sam/Hi');
  t.is(statusText, OK);
  t.deepEqual(data, { name: 'Sam', text: 'Hi' });
});

test('get optional param', async t => {
  const res = await caller.get('/no-user/getOptionalParam');
  t.is(res.statusText, OK);
  t.deepEqual(res.data, {});

  const { statusText, data } = await caller.get('/no-user/getOptionalParam/hello');
  t.is(statusText, OK);
  t.deepEqual(data, { text: 'hello' });
});

test('get paramsFromQuery', async t => {
  const { statusText, data } = await caller.get('/no-user/paramsFromQuery', {
    params: {
      number: 12345,
      text: 'hello'
    }
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    number: '12345',
    text: 'hello'
  });
});

test('get mix params query', async t => {
  const { statusText, data } = await caller.get('/no-user/mixParams/sam', {
    params: {
      number: 12345,
      text: 'hello'
    }
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    name: 'sam',
    number: '12345',
    text: 'hello'
  });
});

test('get mix params query body', async t => {
  const { statusText, data } = await caller.post('/no-user/mixParams/sam?text=hello', {
    number: 12345
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    name: 'sam',
    number: 12345,
    text: 'hello'
  });
});

test('get test promise', async t => {
  const { statusText, data } = await caller.get('/no-user/promiseTest/Hi-Promise');
  t.is(statusText, OK);
  t.is(data, 'Hi-Promise');
});

test('get argsGetter query', async t => {
  const { statusText, data } = await caller.get('/no-user/argsGetterQuery', {
    params: {
      name: 'sam',
      text: 'hello'
    }
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    name: 'sam',
    text: 'hello'
  });
});

test('get argsGetter body', async t => {
  const { statusText, data } = await caller.post('/no-user/argsGetterBody', {
    name: 'sam',
    text: 'hello'
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    name: 'sam',
    text: 'hello'
  });
});

test('get postRecipe body', async t => {
  const { statusText, data } = await caller.post('/no-user/postRecipe', {
    name: 'sam',
    text: 'hello'
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    name: 'sam',
    text: 'hello'
  });
});

// Items service test
test('Items service', async t => {
  const { statusText, data } = await caller.get(path.normalize('/items/total'));
  t.is(statusText, OK);
  t.is(data, 100);
});

test('Items service app get test', async t => {
  const { statusText, data } = await caller.get(path.normalize('/items/app-get-test'));
  t.is(statusText, OK);
  t.deepEqual(data, {
    appItem: 'test',
    superTestVal: 'hello',
    total: 100
  });
});

test('Items service Composers test validating auth', async t => {
  const { statusText, data } = await caller.get(path.normalize('/items/auth-test'), {
    headers: { 'authorization': 'some-token' }
  });
  t.is(statusText, OK);
  t.is(data, 'some-token');
});

test('Items service Composers test validating auth 401 err', async t => {
  try {
    await caller.get(path.normalize('/items/auth-test'), {
      headers: { 'authorization': 'some-token--' }
    });
  } catch (err) {
    t.is(err.response.status, 401);
  }
});

test('Items service token and params', async t => {
  const { statusText, data } = await caller.get(path.normalize('/items/test-token-params/hi'), {
    headers: { 'authorization': 'some-token' }
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    text: 'hi'
  });
});

test('Items service token and body', async t => {
  const text = 'hi';
  const { statusText, data } = await caller.post(path.normalize('/items/test-token-body'), {
    headers: { 'authorization': 'some-token' },
    text
  });
  t.is(statusText, OK);
  t.deepEqual(data, {
    text
  });
});

test('Items service admin only route', async t => {
  const { statusText, data } = await caller.get(path.normalize('/items/admin-only-route/admin'));
  t.is(statusText, OK);
  t.is(data, 'Hi Admin.');
});

test('Items service normal user accessing admin only route 403 err', async t => {
  try {
    await caller.get(path.normalize('/items/admin-only-route/user'));
  } catch (err) {
    t.is(err.response.status, 403);
  }
});
