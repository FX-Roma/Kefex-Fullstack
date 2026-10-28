import { Router } from 'express';
import { registro, iniciarSesion, iniciarSesionUsuario, iniciarSesionAdmin } from '../Controller/Kauth.controller.js';

const router = Router();

// Canonical role-specific auth endpoints.
router.post('/user/register', registro);
router.post('/user/login', iniciarSesionUsuario);
router.post('/admin/login', iniciarSesionAdmin);

// Backward-compatible aliases consumed by the current Angular frontend.
// Public registration always creates rol='user'; /login also refuses admin accounts.
router.post('/registro', registro);
router.post('/register', registro);
router.post('/inicio-sesion', iniciarSesionUsuario);
router.post('/login', iniciarSesionUsuario);

export default router;
