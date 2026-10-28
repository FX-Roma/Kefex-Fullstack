import { Router } from 'express';
import { autenticar, autorizarRoles } from '../middleware/auth.middleware.js';
import { obtenerPerfil, actualizarPerfil, listarUsuariosAdmin } from '../Controller/Kprofile.controller.js';
const router = Router();
router.get('/profile', autenticar, autorizarRoles('user'), obtenerPerfil);
router.put('/profile', autenticar, autorizarRoles('user'), actualizarPerfil);
router.get('/admin/all', autenticar, autorizarRoles('admin'), listarUsuariosAdmin);
export default router;
