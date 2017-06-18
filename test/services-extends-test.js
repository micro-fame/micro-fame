import test from 'ava';
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

test('call BaseWithRest service remote method directly', async t => {
  const { statusText, data } = await caller.get('/rest-base/remote-base-with-rest');
  t.is(statusText, OK);
  t.is(data, 'hello');
});

test('call BaseWithRest service remote method by Items service', async t => {
  const { statusText, data } = await caller.get('/items/remote-base-with-rest');
  t.is(statusText, OK);
  t.is(data, 'hello');
});

test('call BaseWithoutRest service remote method by User service', async t => {
  const { statusText, data } = await caller.get('/no-user/remote-base-without-rest');
  t.is(statusText, OK);
  t.is(data, 'hello');
});
