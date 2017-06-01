import test from 'ava';
import axios from 'axios';
import path from 'path';
const { Boot } = require('../src');

const OK = 'OK';

let url, caller;

test.before(async t => {
  const { address, port } = await Boot({ rootDir: __dirname });
  url = `http://${address}:${port}`;
  caller = axios.create({
    baseURL: url,
    timeout: 5000
  });
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

// Items model test
test('Items model', async t => {
  const { statusText, data } = await caller.get(path.normalize('/items/total'));
  t.is(statusText, OK);
  t.is(data, 100);
});

