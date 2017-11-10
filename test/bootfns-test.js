import test from 'ava';
import { initServerCaller } from './fixtures';

let app;

test.before(async t => {
  const init = await initServerCaller();
  app = init.app;
});

test('Connected to mongodb `test` database', async t => {
  t.is(app.get('db').databaseName, 'test');
});
