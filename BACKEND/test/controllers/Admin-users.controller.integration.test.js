import { describe, test } from '@jest/globals';

/**
 * KEFEX HTTP integration-test template — intentionally todo-only.
 * Route base: /api/usuarios
 * Exercise the real Express router/middleware/controller stack with Supertest.
 * Use mocked Mongoose models or a disposable in-memory database; never Atlas.
 * Middleware: autenticar + autorizarRoles('admin') on all routes.
 * Concrete integration cases:
 * - Todas las rutas requieren JWT y rol admin
 * - POST normal/admin: hash de password, respuesta sanitizada y conflictos 409
 * - GET/PUT/DELETE: códigos HTTP, ID inválido y acceso no admin
 */
describe("Admin-users.routes — integration", () => {
  test.todo("Todas las rutas requieren JWT y rol admin");
  test.todo("POST normal/admin: hash de password, respuesta sanitizada y conflictos 409");
  test.todo("GET/PUT/DELETE: códigos HTTP, ID inválido y acceso no admin");
});
