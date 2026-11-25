
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockCreate = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockDeleteOne = jest.fn();
const mockPopulate = jest.fn();
const mockLimit = jest.fn();
const mockSkip = jest.fn();
const mockSort = jest.fn();

jest.unstable_mockModule('../../src/Models/Publication.model.js', () => ({
  default: {
    create: mockCreate,
    find: jest.fn(() => ({ sort: mockSort })),
    findById: mockFindById,
    findByIdAndUpdate: mockFindByIdAndUpdate,
  },
}));

const { default: Publicacion } = await import('../../src/Models/Publication.model.js');
const {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  actualizarPublicacion,
  eliminarPublicacion,
} = await import('../../src/Controller/User-publications.controller.js');

const response = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const makeQuery = (value) => {
  mockSort.mockReturnValue({ skip: mockSkip });
  mockSkip.mockReturnValue({ limit: mockLimit });
  mockLimit.mockReturnValue({ populate: mockPopulate });
  mockPopulate.mockResolvedValue(value);
};

describe('User-publications.controller — KEFEX contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteOne.mockResolvedValue({ acknowledged: true });
  });

  describe('crearPublicacion', () => {
    test('creates a publication using authenticated user and trimmed fields', async () => {
      const saved = { _id: 'p1', autor: 'u1', contenido: 'Hola', categoria: 'gaming' };
      mockCreate.mockResolvedValue(saved);
      const req = { auth: { id: 'u1' }, body: { contenido: '  Hola  ', categoria: ' gaming ' }, file: undefined };
      const res = response();

      await crearPublicacion(req, res);

      expect(mockCreate).toHaveBeenCalledWith({
        autor: 'u1', contenido: 'Hola', categoria: 'gaming', multimedia: null,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Publicación creada correctamente', publicacion: saved });
    });

    test('uses uploaded image path and ignores non-string required fields', async () => {
      mockCreate.mockResolvedValue({ _id: 'p2' });
      const req = { auth: { id: 'u2' }, body: { contenido: ' Post ', categoria: ' tech ', multimedia: '/external' }, file: { filename: 'safe.webp' } };
      const res = response();
      await crearPublicacion(req, res);
      expect(mockCreate).toHaveBeenCalledWith({
        autor: 'u2', contenido: 'Post', categoria: 'tech', multimedia: '/uploads/safe.webp',
      });

      const invalidRes = response();
      await crearPublicacion({ auth: { id: 'u2' }, body: { contenido: 42, categoria: ['x'] } }, invalidRes);
      expect(invalidRes.status).toHaveBeenCalledWith(400);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    test('accepts existing multimedia URL when no file is uploaded and reports database errors', async () => {
      mockCreate.mockResolvedValueOnce({ _id: 'p3' }).mockRejectedValueOnce(new Error('database unavailable'));
      const req = { auth: { id: 'u3' }, body: { contenido: 'x', categoria: 'y', multimedia: 'https://cdn.example/image.webp' } };
      const res = response();
      await crearPublicacion(req, res);
      expect(mockCreate).toHaveBeenLastCalledWith({
        autor: 'u3', contenido: 'x', categoria: 'y', multimedia: 'https://cdn.example/image.webp',
      });

      const failed = response();
      await crearPublicacion(req, failed);
      expect(failed.status).toHaveBeenCalledWith(500);
      expect(failed.json).toHaveBeenCalledWith({ mensaje: 'Error al crear la publicación', error: 'database unavailable' });
    });
  });

  describe('obtenerPublicaciones', () => {
    test('filters by category, escapes regex input, clamps pagination and projects safe author fields', async () => {
      const rows = [{ _id: 'p1' }];
      const find = jest.spyOn(Publicacion, 'find');
      makeQuery(rows);
      const req = { query: { categoria: ' gaming ', q: 'a+b.*', page: '-5', limit: '999' } };
      const res = response();

      await obtenerPublicaciones(req, res);

      expect(find).toHaveBeenCalledWith({
        categoria: 'gaming',
        contenido: { $regex: 'a\\+b\\.\\*', $options: 'i' },
      });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(50);
      expect(mockPopulate).toHaveBeenCalledWith('autor', 'name email avatar');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ publicaciones: rows, page: 1, limit: 50 });
    });

    test('uses default pagination and handles query failures', async () => {
      makeQuery([]);
      const res = response();
      await obtenerPublicaciones({ query: {} }, res);
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(20);
      expect(res.json).toHaveBeenCalledWith({ publicaciones: [], page: 1, limit: 20 });

      jest.spyOn(Publicacion, 'find').mockImplementationOnce(() => { throw new Error('query failed'); });
      const failed = response();
      await obtenerPublicaciones({ query: {} }, failed);
      expect(failed.status).toHaveBeenCalledWith(500);
    });
  });

  describe('obtenerPublicacionPorId', () => {
    test('returns publication and 404 when absent', async () => {
      const populate = jest.fn().mockResolvedValueOnce({ _id: 'p1' }).mockResolvedValueOnce(null);
      mockFindById.mockReturnValue({ populate });
      const res = response();
      await obtenerPublicacionPorId({ params: { id: 'p1' } }, res);
      expect(mockFindById).toHaveBeenCalledWith('p1');
      expect(populate).toHaveBeenCalledWith('autor', 'name email avatar');
      expect(res.status).toHaveBeenCalledWith(200);

      const missing = response();
      await obtenerPublicacionPorId({ params: { id: 'missing' } }, missing);
      expect(missing.status).toHaveBeenCalledWith(404);
    });

    test('returns 500 on Mongoose error', async () => {
      mockFindById.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('cast error')) });
      const res = response();
      await obtenerPublicacionPorId({ params: { id: 'bad' } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('actualizarPublicacion', () => {
    test('allows owner to update only supported fields with validators', async () => {
      mockFindById.mockResolvedValue({ autor: { toString: () => 'u1' } });
      mockFindByIdAndUpdate.mockResolvedValue({ _id: 'p1', contenido: 'updated' });
      const res = response();
      await actualizarPublicacion({
        params: { id: 'p1' }, auth: { id: 'u1', rol: 'user' },
        body: { contenido: ' updated ', categoria: ' tech ', multimedia: null, autor: 'attacker', rol: 'admin' },
      }, res);
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('p1',
        { contenido: 'updated', categoria: 'tech', multimedia: null },
        { new: true, runValidators: true });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('allows admin, rejects non-owner and returns 404 for missing record', async () => {
      mockFindById.mockResolvedValueOnce({ autor: { toString: () => 'u2' } });
      const adminRes = response();
      await actualizarPublicacion({ params: { id: 'p1' }, auth: { id: 'admin', rol: 'admin' }, body: {} }, adminRes);
      expect(adminRes.status).toHaveBeenCalledWith(200);

      mockFindById.mockResolvedValueOnce({ autor: { toString: () => 'u2' } });
      const forbidden = response();
      await actualizarPublicacion({ params: { id: 'p1' }, auth: { id: 'u1', rol: 'user' }, body: {} }, forbidden);
      expect(forbidden.status).toHaveBeenCalledWith(403);

      mockFindById.mockResolvedValueOnce(null);
      const missing = response();
      await actualizarPublicacion({ params: { id: 'p404' }, auth: { id: 'u1', rol: 'user' }, body: {} }, missing);
      expect(missing.status).toHaveBeenCalledWith(404);
    });

    test('handles update database errors and absent update result', async () => {
      mockFindById.mockResolvedValue({ autor: { toString: () => 'u1' } });
      mockFindByIdAndUpdate.mockResolvedValueOnce(null).mockRejectedValueOnce(new Error('write failed'));
      const missing = response();
      await actualizarPublicacion({ params: { id: 'p1' }, auth: { id: 'u1', rol: 'user' }, body: {} }, missing);
      expect(missing.status).toHaveBeenCalledWith(404);

      const failed = response();
      await actualizarPublicacion({ params: { id: 'p1' }, auth: { id: 'u1', rol: 'user' }, body: {} }, failed);
      expect(failed.status).toHaveBeenCalledWith(500);
    });
  });

  describe('eliminarPublicacion', () => {
    test('allows owner/admin and deletes the document', async () => {
      mockFindById.mockResolvedValue({ autor: { toString: () => 'u1' }, deleteOne: mockDeleteOne });
      const res = response();
      await eliminarPublicacion({ params: { id: 'p1' }, auth: { id: 'u1', rol: 'user' } }, res);
      expect(mockDeleteOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);

      mockFindById.mockResolvedValue({ autor: { toString: () => 'u1' }, deleteOne: mockDeleteOne });
      const adminRes = response();
      await eliminarPublicacion({ params: { id: 'p1' }, auth: { id: 'admin', rol: 'admin' } }, adminRes);
      expect(adminRes.status).toHaveBeenCalledWith(200);
    });

    test('rejects non-owner, returns 404 and handles database errors', async () => {
      mockFindById.mockResolvedValueOnce({ autor: { toString: () => 'u2' }, deleteOne: mockDeleteOne });
      const forbidden = response();
      await eliminarPublicacion({ params: { id: 'p1' }, auth: { id: 'u1', rol: 'user' } }, forbidden);
      expect(forbidden.status).toHaveBeenCalledWith(403);

      mockFindById.mockResolvedValueOnce(null);
      const missing = response();
      await eliminarPublicacion({ params: { id: 'none' }, auth: { id: 'u1', rol: 'user' } }, missing);
      expect(missing.status).toHaveBeenCalledWith(404);

      mockFindById.mockRejectedValueOnce(new Error('read failed'));
      const failed = response();
      await eliminarPublicacion({ params: { id: 'p1' }, auth: { id: 'u1', rol: 'user' } }, failed);
      expect(failed.status).toHaveBeenCalledWith(500);
    });
  });
});
