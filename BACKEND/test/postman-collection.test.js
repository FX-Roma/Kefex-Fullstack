import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const collectionPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../POSTMAN/KEFEX BACKEND API — Current environment.postman_collection.json');
const collection = JSON.parse(await readFile(collectionPath, 'utf8'));
const requests = [];
function flatten(items, folders = []) {
  for (const item of items) {
    if (item.item) flatten(item.item, [...folders, item.name]);
    else if (item.request) requests.push({ name: item.name, folders, method: item.request.method, url: item.request.url.raw, request: item.request, event: item.event ?? [] });
  }
}
flatten(collection.item);

test('Postman collection is schema v2.1 and targets local KEFEX API', () => {
  assert.equal(collection.info.schema, 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
  assert.equal(collection.variable.find((variable) => variable.key === 'baseUrl')?.value, 'http://localhost:3005');
  assert.ok(requests.length >= 50, `Expected broad endpoint coverage, got ${requests.length} requests`);
});

test('auth, profile, publication and resource CRUD routes are covered', () => {
  const urls = requests.map((request) => `${request.method} ${request.url}`);
  for (const expected of [
    'POST {{baseUrl}}/api/auth/user/register',
    'POST {{baseUrl}}/api/auth/user/login',
    'POST {{baseUrl}}/api/auth/admin/login',
    'GET {{baseUrl}}/api/usuario/profile',
    'PUT {{baseUrl}}/api/usuario/profile',
    'POST {{baseUrl}}/api/publicaciones'
  ]) assert.ok(urls.includes(expected), `Missing request: ${expected}`);
  assert.ok(urls.some((url) => url.startsWith('GET {{baseUrl}}/api/publicaciones')), 'Missing read-all publications request');
});

test('admin login supplies credentials and stores the JWT for fallback mode', () => {
  const request = requests.find((item) => item.url === '{{baseUrl}}/api/auth/admin/login');
  assert.ok(request?.request.body?.raw.includes('{{adminEmail}}'));
  assert.ok(request?.event?.some((event) => event.listen === 'test' && event.script.exec.join('\n').includes('adminToken')));
});

test('protected Postman requests have explicit role headers and JWT fallback headers', () => {
  const protectedRequests = requests.filter((item) => item.request.header?.some((header) => header.key === 'X-Dev-Role'));
  assert.ok(protectedRequests.length > 20);
  for (const item of protectedRequests) {
    assert.ok(item.request.header.some((header) => header.key === 'Authorization'), `${item.name} lacks JWT fallback`);
  }
});
