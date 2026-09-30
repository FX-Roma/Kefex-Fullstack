import { Router } from "express";
import { 
    crearProducto, 
    obtenerProductos, 
    obtenerProductoPorId, 
    actualizarProducto, 
    eliminarProducto 
} from "../Controller/E-productStoreController.js"; 

const routerProduct = Router();

routerProduct.post('/', crearProducto);
routerProduct.get('/', obtenerProductos);
routerProduct.get('/:id', obtenerProductoPorId);
routerProduct.put('/:id', actualizarProducto);
routerProduct.delete('/:id', eliminarProducto);

export default routerProduct;