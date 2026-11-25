import { describe, test } from '@jest/globals';

/**
 * KEFEX HTTP integration-test template — intentionally todo-only.
 * Route base: /api/sites
 * Exercise the real Express router/middleware/controller stack with Supertest.
 * Use mocked Mongoose models or a disposable in-memory database; never Atlas.
 * Middleware: autenticar + admin role on POST/PUT/DELETE.
 * Concrete integration cases:
 * - GET list/featured/detail: status y contrato HTTP
 * - POST/PUT/DELETE: JWT admin; usuario normal recibe 403
 * - payload inválido, recurso inexistente y error global
 */
describe("Admin-sites.routes — integration", () => {
  test.todo("GET list/featured/detail: status y contrato HTTP");
  test.todo("POST/PUT/DELETE: JWT admin; usuario normal recibe 403");
  test.todo("payload inválido, recurso inexistente y error global");
});
