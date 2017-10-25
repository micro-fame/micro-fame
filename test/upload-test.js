import test from 'ava';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import { initServerCaller } from './fixtures';

const OK = 'OK';

let caller;

test.before(async t => {
  const init = await initServerCaller();
  caller = init.caller;
});

test('Uploading a file, ignoring JSON body parse', async t => {
  const form = new FormData();
  form.append('number', 'number');
  form.append('file1', fs.createReadStream(path.join(__dirname, '/sample.png')));
  const { statusText, data } = await caller.post('/upload/item', form, {
    headers: form.getHeaders()
  });
  t.is(statusText, OK);
  t.deepEqual(Object.keys(data), ['files', 'fields']);
  t.deepEqual(data.fields, { number: 'number' });
  t.is(data.files.file1.name, 'sample.png');
});
