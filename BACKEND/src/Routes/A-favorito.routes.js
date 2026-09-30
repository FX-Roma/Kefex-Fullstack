import express from "express";

import {
    agregarFavorito,
    obtenerFavoritos,
    obtenerFavoritosPorUsuario,
    eliminarFavorito
} from "../Controller/A-favorito.controller.js";

const router = express.Router();

router.post("/", agregarFavorito);

router.get("/", obtenerFavoritos);

router.get("/usuario/:usuarioId", obtenerFavoritosPorUsuario);

router.delete("/:id", eliminarFavorito);

export default router;