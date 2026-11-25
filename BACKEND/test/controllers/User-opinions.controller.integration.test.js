import { describe, test } from '@jest/globals';

/**
 * KEFEX HTTP integration-test template — intentionally todo-only.
 * Route base: /api/opinions
 * Exercise the real Express router/middleware/controller stack with Supertest.
 * Use mocked Mongoose models or a disposable in-memory database; never Atlas.
 * Middleware: autenticar on writes; admin role on DELETE.
 * Concrete integration cases:
 * - GET list/detail públicas; POST/PUT requieren JWT; DELETE requiere admin
 * - payload inválido, recurso inexistente y permisos
 * - consistencia con comentarios y búsqueda sin ampliar el contrato actual
 */
describe("User-opinions.routes — integration", () => {
  test.todo("GET list/detail públicas; POST/PUT requieren JWT; DELETE requiere admin");
  test.todo("payload inválido, recurso inexistente y permisos");
  test.todo("consistencia con comentarios y búsqueda sin ampliar el contrato actual");
});
