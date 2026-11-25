import { describe, test } from '@jest/globals';

/**
 * KEFEX HTTP integration-test template — intentionally todo-only.
 * Route base: /api/productos
 * Exercise the real Express router/middleware/controller stack with Supertest.
 * Use mocked Mongoose models or a disposable in-memory database; never Atlas.
 * Middleware: autenticar, autorizarRoles('admin'), uploadSingleImage on POST/PUT.
 * Concrete integration cases:
 * - GET collection/detail: status, payload y consulta pública
 * - POST/PUT: JWT, rol admin, multipart imagen y validaciones
 * - DELETE: 401/403 para acceso no autorizado y respuesta de eliminación
 */
describe("Admin-products.routes — integration", () => {
  test.todo("GET collection/detail: status, payload y consulta pública");
  test.todo("POST/PUT: JWT, rol admin, multipart imagen y validaciones");
  test.todo("DELETE: 401/403 para acceso no autorizado y respuesta de eliminación");
});
