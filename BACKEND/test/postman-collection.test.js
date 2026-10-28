import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const collectionUrl = new URL('../src/non-related/KEFEX_Backend_API.postman_collection.json', import.meta.url);
const collection = JSON.parse(await readFile(collectionUrl, 'utf8'));
const requests = collection.item.map((item) => ({ name: item.name, method: item.request.method, url: item.request.url.raw }));

test('Postman collection uses schema v2.1 and a local KEFEX API base URL', () => {
  assert.equal(collection.info.schema, 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
  assert.equal(collection.variable.find((variable) => variable.key === 'baseUrl')?.value, 'http://localhost:3005');
  assert.ok(requests.length >= 25, `Expected broad endpoint coverage, got ${requests.length} requests`);
});

test('required authentication, profile, admin and publication routes are covered', () => {
  const urls = requests.map((request) => `${request.method} ${request.url}`);
  for (const expected of [
    'POST {{baseUrl}}/api/auth/register',
    'POST {{baseUrl}}/api/auth/login',
    'GET {{baseUrl}}/api/usuario/profile',
    'GET {{baseUrl}}/api/usuario/admin/all',
    'GET {{baseUrl}}/api/publicaciones',
    'POST {{baseUrl}}/api/publicaciones'
  ]) assert.ok(urls.includes(expected), `Missing request: ${expected}`);
});

test('publication creation is configured for multipart form data', () => {
  const request = collection.item.find((item) => item.name === 'Publications / Create (multipart/form-data)');
  assert.ok(request);
  assert.equal(request.request.body.mode, 'formdata');
  assert.ok(request.request.body.formdata.some((field) => field.key === 'imagen' && field.type === 'file'));
});
