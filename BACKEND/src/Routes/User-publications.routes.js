
import express from 'express';
import { crearPublicacion, obtenerPublicaciones, obtenerPublicacionPorId, actualizarPublicacion, eliminarPublicacion } from '../Controller/User-publications.controller.js';
import {autenticar,autorizarRoles} from '../middleware/auth.middleware.js';

import { uploadSingleImage } from '../middleware/upload.middleware.js';
const router = express.Router();
router.get('/', obtenerPublicaciones);
router.get('/:id', obtenerPublicacionPorId);
router.post('/', autenticar, uploadSingleImage, crearPublicacion);
router.put('/:id', autenticar, actualizarPublicacion);
router.delete('/:id', autenticar, autorizarRoles('admin'), eliminarPublicacion);
export default router;
