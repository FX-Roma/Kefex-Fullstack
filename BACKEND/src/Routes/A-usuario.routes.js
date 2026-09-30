import express from "express";

import {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} from "../Controller/A-usuario.controller.js";

const router = express.Router();

router.post("/", crearUsuario);

router.get("/", obtenerUsuarios);

router.get("/:id", obtenerUsuarioPorId);

router.put("/:id", actualizarUsuario);

router.delete("/:id", eliminarUsuario);

export default router;