
import express from 'express';
import { crearPublicacion, obtenerPublicaciones, obtenerPublicacionPorId, actualizarPublicacion, eliminarPublicacion } from '../Controller/A-publicacion.controller.js';
import { autenticar } from '../middleware/auth.middleware.js';

import { uploadSingleImage } from '../middleware/E -uploadMiddleware.js';
const router = express.Router();
router.get('/', obtenerPublicaciones);
router.get('/:id', obtenerPublicacionPorId);
router.post('/', autenticar, uploadSingleImage, crearPublicacion);
router.put('/:id', autenticar, actualizarPublicacion);
router.delete('/:id', autenticar, eliminarPublicacion);
export default router;
