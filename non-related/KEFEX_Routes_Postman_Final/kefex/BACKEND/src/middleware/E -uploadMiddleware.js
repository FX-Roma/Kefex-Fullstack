import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(currentDir, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, extension).normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'image';
    callback(null, `${Date.now()}-${safeBase}${extension}`);
  }
});
const imageOnly = (_req, file, callback) => {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) return callback(new Error('Solo se permiten imágenes JPEG, PNG, WEBP o GIF.'));
  callback(null, true);
};
export const uploadSingleImage = multer({ storage, fileFilter: imageOnly, limits: { fileSize: 5 * 1024 * 1024, files: 1 } }).single('imagen');
