import { afterEach, beforeAll, describe, expect, test } from '@jest/globals';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import { fileURLToPath } from 'node:url';
import { uploadSingleImage } from '../../src/middleware/upload.middleware.js';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const uploadDir = path.join(backendDir, 'uploads');
const baselineFiles = new Set(fs.readdirSync(uploadDir));
const app = express();

app.post('/upload', uploadSingleImage, (req, res) => {
  res.status(201).json({
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});
app.use((error, _req, res, _next) => {
  const status = error?.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  res.status(status).json({ error: error.message });
});

afterEach(() => {
  for (const filename of fs.readdirSync(uploadDir)) {
    if (!baselineFiles.has(filename)) {
      try { fs.unlinkSync(path.join(uploadDir, filename)); } catch {}
    }
  }
});

describe('upload.middleware — HTTP integration', () => {
  test('accepts allowlisted image MIME and generates a server-controlled filename', async () => {
    const response = await request(app).post('/upload')
      .attach('imagen', Buffer.from('test-image-data'), { filename: '../../unsafe-name.webp', contentType: 'image/webp' })
      .expect(201);

    expect(response.body.mimetype).toBe('image/webp');
    expect(response.body.filename).toMatch(/^\d+-[0-9a-f-]+\.webp$/i);
    expect(response.body.filename).not.toContain('unsafe-name');
    expect(fs.existsSync(path.join(uploadDir, response.body.filename))).toBe(true);
  });

  test('rejects unsupported MIME types and unexpected multipart field names', async () => {
    await request(app).post('/upload')
      .attach('imagen', Buffer.from('not an image'), { filename: 'file.txt', contentType: 'text/plain' })
      .expect(400);

    await request(app).post('/upload')
      .attach('otherField', Buffer.from('image'), { filename: 'image.png', contentType: 'image/png' })
      .expect(400);
  });

  test('enforces the 5 MiB upload limit', async () => {
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 0x61);
    await request(app).post('/upload')
      .attach('imagen', oversized, { filename: 'large.png', contentType: 'image/png' })
      .expect(413);
  });
});
