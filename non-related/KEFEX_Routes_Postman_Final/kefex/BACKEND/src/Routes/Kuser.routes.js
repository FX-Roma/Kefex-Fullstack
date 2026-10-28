import { Router } from 'express';
import { autenticar, autorizarRoles } from '../middleware/auth.middleware.js';
import { obtenerPerfil, actualizarPerfil } from '../Controller/Kprofile.controller.js';
import { crearPublicacion, obtenerPublicaciones, obtenerPublicacionPorId, actualizarPublicacion, eliminarPublicacion } from '../Controller/A-publicacion.controller.js';
import { agregarFavorito, obtenerFavoritos, eliminarFavorito } from '../Controller/A-favorito.controller.js';
import { obtenerCarrito, agregarAlCarrito, actualizarCantidadCarrito, eliminarDelCarrito, vaciarCarrito } from '../Controller/K-carritoController.js';
import { uploadSingleImage } from '../middleware/E -uploadMiddleware.js';

const router = Router();
router.use(autenticar, autorizarRoles('user'));

// User-only profile namespace; its shape can evolve independently from admin profile.
router.get('/profile', obtenerPerfil);
router.patch('/profile', actualizarPerfil);
router.put('/profile', actualizarPerfil); // compatibility with the current frontend

// User-owned content. Controllers verify ownership for updates/deletes.
router.get('/publications', obtenerPublicaciones);
router.post('/publications', uploadSingleImage, crearPublicacion);
router.get('/publications/:id', obtenerPublicacionPorId);
router.put('/publications/:id', actualizarPublicacion);
router.delete('/publications/:id', eliminarPublicacion);

router.get('/favorites', obtenerFavoritos);
router.post('/favorites', agregarFavorito);
router.delete('/favorites/:id', eliminarFavorito);

router.get('/cart/:userId', (req, res, next) => { req.params.usuarioId = req.params.userId; next(); }, obtenerCarrito);
router.post('/cart/items', agregarAlCarrito);
router.put('/cart/:userId/items/:itemId', (req, res, next) => { req.params.usuarioId = req.params.userId; next(); }, actualizarCantidadCarrito);
router.delete('/cart/:userId/items/:itemId', (req, res, next) => { req.params.usuarioId = req.params.userId; next(); }, eliminarDelCarrito);
router.delete('/cart/:userId', (req, res, next) => { req.params.usuarioId = req.params.userId; next(); }, vaciarCarrito);

export default router;
