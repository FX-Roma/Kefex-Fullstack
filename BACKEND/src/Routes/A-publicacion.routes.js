import express from "express";

import {
    crearPublicacion,
    obtenerPublicaciones,
    obtenerPublicacionPorId,
    actualizarPublicacion,
    eliminarPublicacion
} from "../Controller/A-publicacion.controller.js";

const router = express.Router();

router.post("/", crearPublicacion);

router.get("/", obtenerPublicaciones);

router.get("/:id", obtenerPublicacionPorId);

router.put("/:id", actualizarPublicacion);

router.delete("/:id", eliminarPublicacion);

export default router;