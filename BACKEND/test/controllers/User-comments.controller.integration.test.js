import { describe, test } from '@jest/globals';

/**
 * KEFEX HTTP integration-test template — intentionally todo-only.
 * Route base: /api/comments
 * Exercise the real Express router/middleware/controller stack with Supertest.
 * Use mocked Mongoose models or a disposable in-memory database; never Atlas.
 * Middleware: autenticar on POST/PUT/DELETE.
 * Concrete integration cases:
 * - GET list/detail públicas; mutaciones requieren JWT
 * - payload incorrecto, opinión inexistente y códigos HTTP
 * - verificar que usuario no pueda modificar comentario ajeno según implementación
 */
describe("User-comments.routes — integration", () => {
  test.todo("GET list/detail públicas; mutaciones requieren JWT");
  test.todo("payload incorrecto, opinión inexistente y códigos HTTP");
  test.todo("verificar que usuario no pueda modificar comentario ajeno según implementación");
});
