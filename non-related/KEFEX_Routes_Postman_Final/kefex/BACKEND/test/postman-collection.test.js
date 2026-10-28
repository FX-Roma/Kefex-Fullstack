import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (relative) => readFile(path.resolve(here, relative), 'utf8');
const collection = JSON.parse(await read('../postman/KEFEX_Backend_API_Organized.postman_collection.json'));

function flatten(items, parents = []) {
  return items.flatMap((item) => item.item
    ? flatten(item.item, [...parents, item.name])
    : [{ ...item, parents }]);
}
const requests = flatten(collection.item);
const route = (method, suffix) => requests.find((item) => item.request.method === method && item.request.url.raw.endsWith(suffix));

test('Postman collection uses v2.1 and the configured local base URL', () => {
  assert.equal(collection.info.schema, 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
  assert.equal(collection.variable.find((v) => v.key === 'baseUrl')?.value, 'http://localhost:3005');
  assert.ok(requests.length >= 50, `Expected broad API coverage, got ${requests.length}`);
});

test('Authentication has separate USER and ADMIN login paths and independent tokens', () => {
  assert.ok(route('POST', '/api/auth/user/register'));
  assert.ok(route('POST', '/api/auth/user/login'));
  assert.ok(route('POST', '/api/auth/admin/login'));
  assert.ok(collection.variable.some((v) => v.key === 'userToken'));
  assert.ok(collection.variable.some((v) => v.key === 'adminToken'));
});

test('Canonical USER and ADMIN profiles are separately represented in Postman', () => {
  assert.ok(route('GET', '/api/user/profile'));
  assert.ok(route('GET', '/api/admin/profile'));
  assert.ok(route('GET', '/api/admin/users-summary'));
  assert.ok(route('POST', '/api/admin/users'));
});

test('Publication upload uses multipart form data and admin moderation uses admin namespace', () => {
  const create = requests.find((item) => item.name === 'Create publication (multipart/form-data)');
  assert.ok(create, 'Publication creation request missing');
  assert.equal(create.request.body.mode, 'formdata');
  assert.ok(create.request.body.formdata.some((field) => field.key === 'imagen' && field.type === 'file'));
  assert.ok(route('DELETE', '/api/admin/publications/{{publicationId}}'));
});

test('USER and ADMIN router modules enforce their roles at router level', async () => {
  const userRoutes = await read('../src/Routes/Kuser.routes.js');
  const adminRoutes = await read('../src/Routes/Kadmin.routes.js');
  assert.match(userRoutes, /router\.use\(autenticar, autorizarRoles\('user'\)\)/);
  assert.match(adminRoutes, /router\.use\(autenticar, autorizarRoles\('admin'\)\)/);
});

test('Public registration hardcodes the user role and admin login checks the role', async () => {
  const authController = await read('../src/Controller/Kauth.controller.js');
  const authRoutes = await read('../src/Routes/Kauth.routes.js');
  assert.match(authController, /rol:\s*'user'/);
  assert.match(authController, /iniciarSesionAdmin\s*=\s*\(req, res\)\s*=>\s*iniciarSesion\(req, res, 'admin'\)/);
  assert.match(authRoutes, /router\.post\('\/admin\/login', iniciarSesionAdmin\)/);
});
