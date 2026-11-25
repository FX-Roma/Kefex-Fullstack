import { describe, test } from '@jest/globals';

/**
 * KEFEX unit-test template — intentionally todo-only.
 * Controller: src/Controller/User-comments.controller.js
 * Current route base: /api/comments
 * Models/dependencies to mock: Comment.model.js, Opinion.model.js.
 *
 * Unit cases (call exported controller functions directly with req/res/next mocks):
 * - readAllComments/readCommentByID: resultados y 404
 * - createComment: relación con opinión y validación
 * - updateComment/deleteCommentByID: propiedad y errores
 * Keep tests deterministic: no Atlas connection, SMTP, filesystem side effects,
 * * external HTTP or real credentials. Reset mocks between tests.
 */
describe('User-comments.controller — unit', () => {
  test.todo("readAllComments/readCommentByID: resultados y 404");
  test.todo("createComment: relación con opinión y validación");
  test.todo("updateComment/deleteCommentByID: propiedad y errores");
});
