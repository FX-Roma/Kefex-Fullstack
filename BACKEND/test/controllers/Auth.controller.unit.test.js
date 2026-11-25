import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockExists = jest.fn();
const mockCreate = jest.fn();
const mockFindOne = jest.fn();
const mockFindById = jest.fn();
const mockHash = jest.fn();
const mockCompare = jest.fn();
const mockSign = jest.fn();
const mockSendMail = jest.fn();

jest.unstable_mockModule('../../src/Models/User.model.js', () => ({
  default: { exists: mockExists, create: mockCreate, findOne: mockFindOne, findById: mockFindById },
}));
jest.unstable_mockModule('bcryptjs', () => ({
  default: { hash: mockHash, compare: mockCompare },
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: mockSign },
}));
jest.unstable_mockModule('nodemailer', () => ({
  default: { createTransport: jest.fn(() => ({ sendMail: mockSendMail })) },
}));

const {
  registro,
  iniciarSesion,
  iniciarSesionUsuario,
  iniciarSesionAdmin,
  forgotPassword,
  cambiarPassword,
} = await import('../../src/Controller/Auth.controller.js');

const response = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('Auth.controller — unit contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'unit-test-secret-with-at-least-32-characters';
    process.env.JWT_EXPIRES_IN = '8h';
    process.env.EMAIL_NODE = 'noreply@example.test';
    mockExists.mockResolvedValue(false);
    mockHash.mockResolvedValue('hashed-password');
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue('signed.jwt.token');
    mockSendMail.mockResolvedValue({ accepted: ['user@example.test'] });
  });

  describe('registro', () => {
    test('rejects missing fields and passwords shorter than eight characters', async () => {
      const res = response();
      await registro({ body: { name: ' ', email: 'bad', password: '1234567' } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    test('normalizes email, hashes password and returns a safe user projection', async () => {
      mockCreate.mockResolvedValue({ _id: 'u1', name: 'Ada', email: 'ada@example.test', rol: 'user', password: 'secret' });
      const res = response();
      await registro({ body: { name: ' Ada ', email: ' ADA@EXAMPLE.TEST ', password: 'password123' } }, res);
      expect(mockExists).toHaveBeenCalledWith({ email: 'ada@example.test' });
      expect(mockHash).toHaveBeenCalledWith('password123', 12);
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'Ada', email: 'ada@example.test', password: 'hashed-password', rol: 'user',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      const body = res.json.mock.calls[0][0];
      expect(body.data).toEqual({ id: 'u1', name: 'Ada', email: 'ada@example.test', rol: 'user' });
      expect(JSON.stringify(body)).not.toContain('password');
    });

    test('rejects an existing email and maps duplicate-key race to 409', async () => {
      mockExists.mockResolvedValue(true);
      const duplicate = response();
      await registro({ body: { name: 'Ada', email: 'ada@example.test', password: 'password123' } }, duplicate);
      expect(duplicate.status).toHaveBeenCalledWith(409);
      expect(mockCreate).not.toHaveBeenCalled();

      mockExists.mockResolvedValue(false);
      mockCreate.mockRejectedValue({ code: 11000, keyPattern: { email: 1 } });
      const race = response();
      await registro({ body: { name: 'Ada', email: 'ada@example.test', password: 'password123' } }, race);
      expect(race.status).toHaveBeenCalledWith(409);
    });

    test('returns a generic 500 when persistence fails', async () => {
      mockExists.mockRejectedValue(new Error('database unavailable'));
      const res = response();
      const log = jest.spyOn(console, 'error').mockImplementation(() => {});
      await registro({ body: { name: 'Ada', email: 'ada@example.test', password: 'password123' } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json.mock.calls[0][0].message).toBe('No fue posible registrar la cuenta.');
      log.mockRestore();
    });
  });

  describe('login', () => {
    const findUser = (user) => {
      mockFindOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
    };

    test('rejects malformed payload and invalid credentials', async () => {
      const invalidPayload = response();
      await iniciarSesion({ body: { username: '', password: '' } }, invalidPayload);
      expect(invalidPayload.status).toHaveBeenCalledWith(400);

      findUser({ estado: 'activo', password: 'hash', rol: 'user' });
      mockCompare.mockResolvedValue(false);
      const invalidCredentials = response();
      await iniciarSesion({ body: { username: 'ADA@EXAMPLE.TEST', password: 'wrong' } }, invalidCredentials);
      expect(mockFindOne).toHaveBeenCalledWith({ email: 'ada@example.test' });
      expect(invalidCredentials.status).toHaveBeenCalledWith(401);
    });

    test('signs JWT with role claims and enforces role-specific login', async () => {
      const user = { _id: { toString: () => 'u1' }, name: 'Ada', email: 'ada@example.test', rol: 'user', estado: 'activo', password: 'hash' };
      findUser(user);
      const res = response();
      await iniciarSesionUsuario({ body: { username: ' Ada@Example.Test ', password: 'password123' } }, res);
      expect(mockSign).toHaveBeenCalledWith({ id: 'u1', name: 'Ada', email: 'ada@example.test', rol: 'user' }, process.env.JWT_SECRET, { expiresIn: '8h' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].data).toBe('signed.jwt.token');
      expect(res.json.mock.calls[0][0].user).toEqual({ id: 'u1', name: 'Ada', email: 'ada@example.test', rol: 'user' });

      const adminFlow = response();
      await iniciarSesionAdmin({ body: { username: 'ada@example.test', password: 'password123' } }, adminFlow);
      expect(adminFlow.status).toHaveBeenCalledWith(403);
      expect(iniciarSesion).toBeDefined();
    });

    test('rejects inactive accounts and handles database failures', async () => {
      findUser({ estado: 'suspendido', password: 'hash' });
      const inactive = response();
      await iniciarSesion({ body: { username: 'ada@example.test', password: 'password123' } }, inactive);
      expect(inactive.status).toHaveBeenCalledWith(401);

      mockFindOne.mockImplementation(() => { throw new Error('query error'); });
      const failed = response();
      await iniciarSesion({ body: { username: 'ada@example.test', password: 'password123' } }, failed);
      expect(failed.status).toHaveBeenCalledWith(500);
    });
  });

  describe('forgotPassword', () => {
    test('validates email and keeps account enumeration response consistent', async () => {
      const invalid = response();
      await forgotPassword({ body: { email: ' ' } }, invalid);
      expect(invalid.status).toHaveBeenCalledWith(400);

      mockFindOne.mockResolvedValue(null);
      const unknown = response();
      await forgotPassword({ body: { email: 'missing@example.test' } }, unknown);
      expect(unknown.status).toHaveBeenCalledWith(200);
      expect(unknown.json.mock.calls[0][0].message).toBe('Si el correo está registrado, recibirás instrucciones de recuperación.');
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    test('sends recovery mail and persists a hashed temporary password', async () => {
      const user = { email: 'ada@example.test', name: 'Ada', save: jest.fn().mockResolvedValue(true) };
      mockFindOne.mockResolvedValue(user);
      const res = response();
      await forgotPassword({ body: { email: ' ADA@EXAMPLE.TEST ' } }, res);
      expect(mockHash).toHaveBeenCalledWith(expect.any(String), 12);
      expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({ to: 'ada@example.test', subject: 'KEFEX - Recuperación de contraseña' }));
      expect(user.password).toBe('hashed-password');
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('cambiarPassword', () => {
    test('validates inputs, current password and rejects password reuse', async () => {
      const invalid = response();
      await cambiarPassword({ body: { passwordActual: 'old', passwordNueva: 'short' }, auth: { id: 'u1' } }, invalid);
      expect(invalid.status).toHaveBeenCalledWith(400);

      mockFindById.mockReturnValue({ select: jest.fn().mockResolvedValue({ password: 'hash' }) });
      mockCompare.mockResolvedValueOnce(false);
      const wrongCurrent = response();
      await cambiarPassword({ body: { passwordActual: 'wrong-pass', passwordNueva: 'new-password' }, auth: { id: 'u1' } }, wrongCurrent);
      expect(wrongCurrent.status).toHaveBeenCalledWith(401);

      mockCompare.mockResolvedValueOnce(true);
      const reused = response();
      await cambiarPassword({ body: { passwordActual: 'old-password', passwordNueva: 'old-password' }, auth: { id: 'u1' } }, reused);
      expect(reused.status).toHaveBeenCalledWith(400);
    });

    test('changes password only after current password is verified', async () => {
      const user = { password: 'old-hash', save: jest.fn().mockResolvedValue(true) };
      mockFindById.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
      mockCompare.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      const res = response();
      await cambiarPassword({ body: { passwordActual: 'old-password', passwordNueva: 'new-password' }, auth: { id: 'u1' } }, res);
      expect(mockHash).toHaveBeenCalledWith('new-password', 12);
      expect(user.password).toBe('hashed-password');
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
