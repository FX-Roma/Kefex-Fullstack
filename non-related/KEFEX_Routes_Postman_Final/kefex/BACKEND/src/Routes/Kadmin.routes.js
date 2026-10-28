import { Router } from 'express';
import { autenticar, autorizarRoles } from '../middleware/auth.middleware.js';
import { obtenerPerfil, actualizarPerfil, listarUsuariosAdmin } from '../Controller/Kprofile.controller.js';
import { crearUsuarioAdmin, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from '../Controller/A-usuario.controller.js';
import { eliminarPublicacion } from '../Controller/A-publicacion.controller.js';
import opinionForumController from '../Controller/E-opinionForumController.js';
import { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto } from '../Controller/E-productStoreController.js';
import siteReviewController from '../Controller/E-siteReviewController.js';

const router = Router();
router.use(autenticar, autorizarRoles('admin'));

// Admin profile endpoints are deliberately separate from /api/user/profile.
router.get('/profile', obtenerPerfil);
router.patch('/profile', actualizarPerfil);
router.put('/profile', actualizarPerfil);

// User and administrator account management. Only an authenticated admin can assign roles.
router.get('/users', obtenerUsuarios);
router.get('/users-summary', listarUsuariosAdmin);
router.get('/users/:id', obtenerUsuarioPorId);
router.post('/users', crearUsuarioAdmin);
router.patch('/users/:id', actualizarUsuario);
router.put('/users/:id', actualizarUsuario);
router.delete('/users/:id', eliminarUsuario);

// Administrative moderation and catalog management.
router.delete('/publications/:id', eliminarPublicacion);
router.delete('/opinions/:id', opinionForumController.deleteOpinion);
router.get('/products', obtenerProductos);
router.get('/products/:id', obtenerProductoPorId);
router.post('/products', crearProducto);
router.put('/products/:id', actualizarProducto);
router.delete('/products/:id', eliminarProducto);
router.get('/sites', siteReviewController.getAllSites);
router.get('/sites/featured', siteReviewController.getFeaturedSite);
router.get('/sites/:id', siteReviewController.getSiteById);
router.post('/sites', siteReviewController.createSite);
router.put('/sites/:id', siteReviewController.updateSite);
router.delete('/sites/:id', siteReviewController.deleteSite);

export default router;
