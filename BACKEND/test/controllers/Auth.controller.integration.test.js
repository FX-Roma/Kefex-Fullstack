import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'integration-test-secret-with-at-least-32-characters';
process.env.POSTMAN_AUTH_BYPASS = 'false';

const userStore = new Map();
let idCounter = 0;
const mockUserExists = jest.fn();
const mockUserCreate = jest.fn();
const mockUserFindOne = jest.fn();
const mockUserFindById = jest.fn();
const mockPublicationModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

jest.unstable_mockModule('../../src/Models/User.model.js', () => ({
  default: {
    exists: mockUserExists,
    create: mockUserCreate,
    findOne: mockUserFindOne,
    findById: mockUserFindById,
  },
}));
jest.unstable_mockModule('../../src/Models/Publication.model.js', () => ({
  default: mockPublicationModel,
}));
jest.unstable_mockModule('nodemailer', () => ({
  default: { createTransport: jest.fn(() => ({ sendMail: jest.fn().mockResolvedValue({ accepted: [] }) })) },
}));

const { default: app } = await import('../../src/server.js');

const activeUserByEmail = (email) => [...userStore.values()].find((user) => user.email === email) || null;
const activeUserById = (id) => userStore.get(String(id)) || null;

mockUserExists.mockImplementation(async ({ email }) => Boolean(activeUserByEmail(email)));
mockUserCreate.mockImplementation(async (data) => {
  const user = {
    ...data,
    _id: `user-${++idCounter}`,
    estado: 'activo',
    async save() { userStore.set(String(this._id), this); return this; },
  };
  userStore.set(String(user._id), user);
  return user;
});
mockUserFindOne.mockImplementation((query) => {
  const userQuery = {
    select: jest.fn().mockImplementation(async () => activeUserByEmail(query.email)),
  };
  userQuery.then = (resolve, reject) => Promise.resolve(activeUserByEmail(query.email)).then(resolve, reject);
  return userQuery;
});
mockUserFindById.mockImplementation((id) => ({
  select: jest.fn().mockImplementation(async () => activeUserById(id)),
}));

describe('Auth routes — HTTP integration', () => {
  beforeEach(() => {
    userStore.clear();
    idCounter = 0;
    jest.clearAllMocks();
  });

  test('registers a user, logs in and never returns password/hash', async () => {
    const registration = await request(app)
      .post('/api/auth/user/register')
      .send({ name: 'Ada Lovelace', email: ' ADA@example.test ', password: 'secure-password-1' });

    expect(registration.status).toBe(201);
    expect(registration.body.data).toMatchObject({ name: 'Ada Lovelace', email: 'ada@example.test', rol: 'user' });
    expect(JSON.stringify(registration.body)).not.toMatch(/password|hash/i);

    const login = await request(app)
      .post('/api/auth/user/login')
      .send({ username: 'ada@example.test', password: 'secure-password-1' });

    expect(login.status).toBe(200);
    expect(login.body.data).toBeTruthy();
    expect(login.body.user).toMatchObject({ email: 'ada@example.test', rol: 'user' });
    expect(JSON.stringify(login.body)).not.toMatch(/password|hash/i);
    expect(jwt.verify(login.body.data, process.env.JWT_SECRET).rol).toBe('user');
  });

  test('enforces role-specific login and duplicate registration', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Ada', email: 'ada@example.test', password: 'secure-password-1',
    }).expect(201);

    await request(app).post('/api/auth/admin/login').send({
      username: 'ada@example.test', password: 'secure-password-1',
    }).expect(403);

    await request(app).post('/api/auth/user/register').send({
      name: 'Ada Again', email: 'ADA@example.test', password: 'secure-password-1',
    }).expect(409);
  });

  test('protects change-password endpoint and updates the stored password hash', async () => {
    await request(app).post('/api/auth/user/register').send({
      name: 'Ada', email: 'ada@example.test', password: 'secure-password-1',
    }).expect(201);

    const login = await request(app).post('/api/auth/user/login').send({
      username: 'ada@example.test', password: 'secure-password-1',
    }).expect(200);

    await request(app).put('/api/auth/change-password')
      .send({ passwordActual: 'secure-password-1', passwordNueva: 'secure-password-2' })
      .expect(401);

    const changed = await request(app).put('/api/auth/change-password')
      .set('Authorization', `Bearer ${login.body.data}`)
      .send({ passwordActual: 'secure-password-1', passwordNueva: 'secure-password-2' })
      .expect(200);
    expect(changed.body.message).toBe('Contraseña actualizada correctamente.');

    const newLogin = await request(app).post('/api/auth/user/login').send({
      username: 'ada@example.test', password: 'secure-password-2',
    }).expect(200);
    expect(newLogin.body.data).toBeTruthy();
  });

  test('returns generic recovery response for unknown email and validates payloads', async () => {
    await request(app).post('/api/auth/forgot-password').send({ email: ' ' }).expect(400);
    const recovery = await request(app).post('/api/auth/forgot-password')
      .send({ email: 'unknown@example.test' }).expect(200);
    expect(recovery.body.message).toBe('Si el correo está registrado, recibirás instrucciones de recuperación.');
  });

  test('keeps legacy login alias available', async () => {
    const response = await request(app).post('/api/auth/login')
      .send({ username: '', password: '' }).expect(400);
    expect(response.body.result).toBe('mal');
  });
});

