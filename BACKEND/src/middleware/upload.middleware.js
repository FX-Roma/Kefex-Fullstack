import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(currentDir, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp']
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => callback(null, `${Date.now()}-${randomUUID()}${allowedTypes.get(file.mimetype) || '.img'}`)
});

const imageOnly = (_req, file, callback) => {
  if (!allowedTypes.has(file.mimetype)) {
    return callback(new Error('Formato no permitido. Utiliza JPEG, PNG o WEBP.'));
  }
  callback(null, true);
};

// Store media files on disk/object storage and persist only their URL/metadata in MongoDB.
export const uploadSingleImage = multer({
  storage,
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
}).single('imagen');
