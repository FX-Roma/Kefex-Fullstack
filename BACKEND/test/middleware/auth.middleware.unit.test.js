
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import jwt from 'jsonwebtoken';

const mockFindOne = jest.fn();
const mockSelect = jest.fn();
const mockFindById = jest.fn();
jest.unstable_mockModule('../../src/Models/User.model.js', () => ({
  default: { findOne: mockFindOne, findById: mockFindById },
}));
const { autenticar, autorizarRoles } = await import('../../src/middleware/auth.middleware.js');

const resFactory = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};
const next = jest.fn();

describe('auth.middleware', () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NODE_ENV: 'test', JWT_SECRET: 'test-secret-with-at-least-32-characters-long' };
    mockFindOne.mockReturnValue({ select: mockSelect });
    mockFindById.mockReturnValue({ select: mockSelect });
  });

  test('rejects missing bearer token', async () => {
    const res = resFactory();
    await autenticar({ get: () => undefined, headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts valid JWT and excludes password projection', async () => {
    const user = { _id: { toString: () => 'u1' }, rol: 'user', estado: 'activo' };
    mockSelect.mockResolvedValue(user);
    const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET);
    const req = { get: () => undefined, headers: { authorization: `Bearer ${token}` } };
    await autenticar(req, resFactory(), next);
    expect(mockFindById).toHaveBeenCalledWith('u1');
    expect(mockSelect).toHaveBeenCalledWith('-password');
    expect(req.auth).toEqual({ id: 'u1', rol: 'user' });
    expect(next).toHaveBeenCalled();
  });

  test('rejects invalid JWT and inactive/missing account', async () => {
    const invalid = resFactory();
    await autenticar({ get: () => undefined, headers: { authorization: 'Bearer invalid' } }, invalid, next);
    expect(invalid.status).toHaveBeenCalledWith(401);

    mockSelect.mockResolvedValueOnce(null);
    const missing = resFactory();
    const token = jwt.sign({ id: 'u404' }, process.env.JWT_SECRET);
    await autenticar({ get: () => undefined, headers: { authorization: `Bearer ${token}` } }, missing, next);
    expect(missing.status).toHaveBeenCalledWith(401);
  });

  test('allows explicitly configured local Postman user and blocks production bypass', async () => {
    process.env.POSTMAN_AUTH_BYPASS = 'true';
    process.env.POSTMAN_DEV_USER_EMAIL = 'person@example.com';
    mockSelect.mockResolvedValue({ _id: { toString: () => 'u2' }, rol: 'user', estado: 'activo' });
    const req = { get: () => 'user', headers: {} };
    await autenticar(req, resFactory(), next);
    expect(mockFindOne).toHaveBeenCalledWith({ email: 'person@example.com' });
    expect(req.auth.rol).toBe('user');

    process.env.NODE_ENV = 'production';
    const res = resFactory();
    await autenticar({ get: () => 'admin', headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('rejects invalid role header and missing configured account email', async () => {
    process.env.POSTMAN_AUTH_BYPASS = 'true';
    const badRole = resFactory();
    await autenticar({ get: () => 'superuser', headers: {} }, badRole, next);
    expect(badRole.status).toHaveBeenCalledWith(400);

    const noEmail = resFactory();
    await autenticar({ get: () => 'admin', headers: {} }, noEmail, next);
    expect(noEmail.status).toHaveBeenCalledWith(503);
  });

  test('enforces role authorization', () => {
    const forbidden = resFactory();
    autorizarRoles('admin')({ auth: { rol: 'user' } }, forbidden, next);
    expect(forbidden.status).toHaveBeenCalledWith(403);
    const allowed = { auth: { rol: 'admin' } };
    autorizarRoles('admin')(allowed, resFactory(), next);
    expect(next).toHaveBeenCalled();
  });
});
