import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'publication-integration-secret-with-32-characters';
process.env.POSTMAN_AUTH_BYPASS = 'false';

const userRecords = new Map([
  ['user-1', { _id: { toString: () => 'user-1' }, name: 'Ada', email: 'ada@example.test', rol: 'user', estado: 'activo' }],
  ['user-2', { _id: { toString: () => 'user-2' }, name: 'Grace', email: 'grace@example.test', rol: 'user', estado: 'activo' }],
  ['admin-1', { _id: { toString: () => 'admin-1' }, name: 'Admin', email: 'admin@example.test', rol: 'admin', estado: 'activo' }],
]);
const mockUserFindById = jest.fn();
const mockPublicationCreate = jest.fn();
const mockPublicationFind = jest.fn();
const mockPublicationFindById = jest.fn();
const mockPublicationFindByIdAndUpdate = jest.fn();

jest.unstable_mockModule('../../src/Models/User.model.js', () => ({
  default: { findById: mockUserFindById },
}));
jest.unstable_mockModule('../../src/Models/Publication.model.js', () => ({
  default: {
    create: mockPublicationCreate,
    find: mockPublicationFind,
    findById: mockPublicationFindById,
    findByIdAndUpdate: mockPublicationFindByIdAndUpdate,
  },
}));
jest.unstable_mockModule('nodemailer', () => ({
  default: { createTransport: jest.fn(() => ({ sendMail: jest.fn().mockResolvedValue({ accepted: [] }) })) },
}));

const { default: app } = await import('../../src/server.js');
const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const uploadDir = path.join(backendDir, 'uploads');
const uploadedPaths = [];

const authToken = (id, rol) => jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '5m' });
const queryFor = (value) => {
  const query = { populate: jest.fn().mockResolvedValue(value) };
  query.then = (resolve, reject) => Promise.resolve(value).then(resolve, reject);
  return query;
};
const publication = (owner = 'user-1') => ({
  _id: 'publication-1',
  autor: { toString: () => owner },
  contenido: 'Initial publication',
  categoria: 'technology',
  multimedia: null,
  deleteOne: jest.fn().mockResolvedValue({ acknowledged: true }),
});

mockUserFindById.mockImplementation((id) => ({
  select: jest.fn().mockResolvedValue(userRecords.get(String(id)) || null),
}));

describe('User-publications routes — HTTP integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPublicationCreate.mockImplementation(async (data) => ({ _id: 'publication-created', ...data }));
    mockPublicationFind.mockImplementation(() => {
      const query = {};
      query.sort = jest.fn(() => query);
      query.skip = jest.fn(() => query);
      query.limit = jest.fn(() => query);
      query.populate = jest.fn().mockResolvedValue([{ _id: 'publication-1', contenido: 'Hello KEFEX' }]);
      return query;
    });
    mockPublicationFindById.mockImplementation(() => queryFor(publication()));
    mockPublicationFindByIdAndUpdate.mockResolvedValue({ _id: 'publication-1', contenido: 'Updated' });
  });

  afterEach(() => {
    for (const filePath of uploadedPaths.splice(0)) {
      try { fs.unlinkSync(filePath); } catch {}
    }
  });

  test('serves public feed with bounded pagination and public author projection', async () => {
    const response = await request(app).get('/api/publicaciones?page=2&limit=10').expect(200);
    expect(response.body).toMatchObject({ page: 2, limit: 10 });
    expect(response.body.publicaciones).toHaveLength(1);
    expect(mockPublicationFind).toHaveBeenCalledWith({});
    const query = mockPublicationFind.mock.results[0].value;
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.limit).toHaveBeenCalledWith(10);
    expect(query.populate).toHaveBeenCalledWith('autor', 'name email avatar');
  });

  test('rejects create without JWT and creates with authenticated identity', async () => {
    await request(app).post('/api/publicaciones')
      .send({ contenido: 'No token', categoria: 'technology' })
      .expect(401);

    const response = await request(app).post('/api/publicaciones')
      .set('Authorization', `Bearer ${authToken('user-1', 'user')}`)
      .send({ contenido: '  My first KEFEX post  ', categoria: ' technology ' })
      .expect(201);

    expect(mockPublicationCreate).toHaveBeenCalledWith({
      autor: 'user-1', contenido: 'My first KEFEX post', categoria: 'technology', multimedia: null,
    });
    expect(response.body.publicacion).toMatchObject({
      _id: 'publication-created', autor: 'user-1', contenido: 'My first KEFEX post',
    });
  });

  test('validates required publication fields and rejects unsupported upload MIME', async () => {
    const token = authToken('user-1', 'user');
    await request(app).post('/api/publicaciones')
      .set('Authorization', `Bearer ${token}`)
      .send({ contenido: '   ', categoria: 'technology' })
      .expect(400);

    await request(app).post('/api/publicaciones')
      .set('Authorization', `Bearer ${token}`)
      .field('contenido', 'Image post')
      .field('categoria', 'technology')
      .attach('imagen', Buffer.from('not really an image'), { filename: 'payload.txt', contentType: 'text/plain' })
      .expect(400);
  });

  test('accepts multipart image upload and stores a generated safe filename', async () => {
    const response = await request(app).post('/api/publicaciones')
      .set('Authorization', `Bearer ${authToken('user-1', 'user')}`)
      .field('contenido', 'Post with image')
      .field('categoria', 'technology')
      .attach('imagen', Buffer.from([0x89, 0x50, 0x4e, 0x47]), { filename: 'user-supplied-name.png', contentType: 'image/png' })
      .expect(201);

    const multimedia = response.body.publicacion.multimedia;
    expect(multimedia).toMatch(/^\/uploads\/\d+-[0-9a-f-]+\.png$/i);
    const savedPath = path.join(uploadDir, path.basename(multimedia));
    expect(fs.existsSync(savedPath)).toBe(true);
    uploadedPaths.push(savedPath);
  });

  test('reads a publication by ID and returns 404 when absent', async () => {
    const detail = await request(app).get('/api/publicaciones/publication-1').expect(200);
    expect(detail.body.publicacion).toMatchObject({ _id: 'publication-1', contenido: 'Initial publication' });
    expect(mockPublicationFindById).toHaveBeenCalledWith('publication-1');

    mockPublicationFindById.mockImplementationOnce(() => queryFor(null));
    await request(app).get('/api/publicaciones/missing').expect(404);
  });

  test('restricts edits to owner/admin and returns 403 to another user', async () => {
    mockPublicationFindById.mockImplementationOnce(() => queryFor(publication('user-2')));
    await request(app).put('/api/publicaciones/publication-1')
      .set('Authorization', `Bearer ${authToken('user-1', 'user')}`)
      .send({ contenido: 'Unauthorized edit' })
      .expect(403);

    mockPublicationFindById.mockImplementationOnce(() => queryFor(publication('user-1')));
    const update = await request(app).put('/api/publicaciones/publication-1')
      .set('Authorization', `Bearer ${authToken('user-1', 'user')}`)
      .send({ contenido: 'Updated content' })
      .expect(200);
    expect(mockPublicationFindByIdAndUpdate).toHaveBeenCalledWith(
      'publication-1', { contenido: 'Updated content' }, { new: true, runValidators: true },
    );
    expect(update.body.publicacion.contenido).toBe('Updated');
  });

  test('enforces admin-only DELETE route and allows admin deletion', async () => {
    await request(app).delete('/api/publicaciones/publication-1')
      .set('Authorization', `Bearer ${authToken('user-1', 'user')}`)
      .expect(403);

    const document = publication('user-1');
    mockPublicationFindById.mockImplementationOnce(() => queryFor(document));
    await request(app).delete('/api/publicaciones/publication-1')
      .set('Authorization', `Bearer ${authToken('admin-1', 'admin')}`)
      .expect(200);
    expect(document.deleteOne).toHaveBeenCalled();
  });
});
