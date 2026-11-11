
import { Router } from 'express';

import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} from '../Controller/Admin-products.controller.js';

import {
  autenticar,
  autorizarRoles
} from '../middleware/auth.middleware.js';

import { uploadSingleImage } from '../middleware/upload.middleware.js';

const routerProduct = Router();

routerProduct.get('/', obtenerProductos);
routerProduct.get('/:id', obtenerProductoPorId);

routerProduct.post(
  '/',
  autenticar,
  autorizarRoles('admin'),
  uploadSingleImage,
  crearProducto
);

routerProduct.put(
  '/:id',
  autenticar,
  autorizarRoles('admin'),
  uploadSingleImage,
  actualizarProducto
);

routerProduct.delete(
  '/:id',
  autenticar,
  autorizarRoles('admin'),
  eliminarProducto
);

export default routerProduct;
