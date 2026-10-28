import { Router } from 'express';
import { registro, iniciarSesion, iniciarSesionUsuario, iniciarSesionAdmin } from '../Controller/Auth.controller.js';
const router = Router();
// Canonical, role-specific auth routes.
router.post('/user/register', registro);
router.post('/user/login', iniciarSesionUsuario);
router.post('/admin/login', iniciarSesionAdmin);
// Backwards-compatible aliases used by older frontend builds and Postman collections.
router.post('/registro', registro);
router.post('/inicio-sesion', iniciarSesion);
router.post('/register', registro);
router.post('/login', iniciarSesion);
export default router;
