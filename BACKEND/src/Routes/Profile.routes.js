import { Router } from 'express';
import { autenticar, autorizarRoles } from '../middleware/auth.middleware.js';
import { obtenerPerfil, actualizarPerfil, listarUsuariosAdmin } from '../Controller/Profile.controller.js';
const router = Router();
router.get('/profile', autenticar, obtenerPerfil);
router.put('/profile', autenticar, actualizarPerfil);
router.get('/admin/all', autenticar, autorizarRoles('admin'), listarUsuariosAdmin);
export default router;
