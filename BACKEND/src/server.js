import express from "express";
import morgan from "morgan";
import path from 'path';
import cors from "cors";

import productoRoutes from "./Routes/E-ProductStoreRoutes.js";
import carritoRoutes from "./Routes/K-carritoRoutes.js";
import authRoutes from "./Routes/Kauth.routes.js";
import usuarioRoutes from "./Routes/A-usuario.routes.js";
import publicacionRoutes from "./Routes/A-publicacion.routes.js";
import favoritoRoutes from "./Routes/A-favorito.routes.js";
import commentsRoutes from "./Routes/K-commentsForYouRoutes.js";
import opinionsRoutes from "./Routes/E-opinionForumRoutes.js";
import sitesRoutes from "./Routes/E-siteReviewRoutes.js";
import searchRoutes from "./Routes/E-searchForumRoutes.js";

const servidorKefex = express();

servidorKefex.use(cors());
servidorKefex.use(morgan("dev"));
servidorKefex.use(express.json());

// API Endpoints
servidorKefex.use("/api/auth", authRoutes);
servidorKefex.use("/api/comments", commentsRoutes);
servidorKefex.use("/api/opinions", opinionsRoutes);
servidorKefex.use("/api/sites", sitesRoutes);
servidorKefex.use("/api/search", searchRoutes);
servidorKefex.use("/api/productos", productoRoutes);
servidorKefex.use("/api/carrito", carritoRoutes);
servidorKefex.use("/api/usuarios", usuarioRoutes);
servidorKefex.use("/api/publicaciones", publicacionRoutes);
servidorKefex.use("/api/favoritos", favoritoRoutes);

servidorKefex.get("/", (req, res) => {
  res.status(200).json({ mensaje: "Servidor KEFEX activo" });
});

servidorKefex.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default servidorKefex;
