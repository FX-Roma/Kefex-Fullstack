import { Router } from "express";
import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
} from "../Controller/K-carritoController.js";

const routerCarrito = Router();

routerCarrito.get("/:usuarioId", obtenerCarrito);
routerCarrito.post("/items", agregarAlCarrito);
routerCarrito.put("/:usuarioId/items/:itemId", actualizarCantidadCarrito);
routerCarrito.delete("/:usuarioId/items/:itemId", eliminarDelCarrito);
routerCarrito.delete("/:usuarioId", vaciarCarrito);

export default routerCarrito;
