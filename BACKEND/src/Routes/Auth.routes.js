import { Router } from 'express';
import { autenticar } from '../middleware/auth.middleware.js';
import { registro, iniciarSesion, iniciarSesionUsuario, iniciarSesionAdmin, forgotPassword, cambiarPassword } from '../Controller/Auth.controller.js';
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
// Recuperar contraseña
router.post('/forgot-password', forgotPassword);
// Cambiar contraseña del usuario autenticado
router.put('/change-password', autenticar, cambiarPassword);
export default router;