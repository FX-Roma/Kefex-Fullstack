import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import productoRoutes from "./Routes/E-ProductStoreRoutes.js";
import carritoRoutes from "./Routes/K-carritoRoutes.js";
import authRoutes from "./Routes/Kauth.routes.js";
import usuarioRoutes from "./Routes/A-usuario.routes.js";
import publicacionRoutes from "./Routes/A-publicacion.routes.js";
import favoritoRoutes from "./Routes/A-favorito.routes.js";
import commentsRoutes from "./Routes/E-commentsForumRoutes.js";
import commentsForYouRoutes from "./Routes/K-commentsForYouRoutes.js";
import opinionsRoutes from "./Routes/E-opinionForumRoutes.js";
import sitesRoutes from "./Routes/E-siteReviewRoutes.js";
import searchRoutes from "./Routes/E-searchForumRoutes.js";
import profileRoutes from "./Routes/Kprofile.routes.js";
import userRoutes from "./Routes/Kuser.routes.js";
import adminRoutes from "./Routes/Kadmin.routes.js";

const servidorKefex = express();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
servidorKefex.use('/uploads', express.static(path.resolve(currentDir, '../uploads'), { fallthrough: false, maxAge: '7d', immutable: true }));

const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:4200').split(',').map((origin) => origin.trim());
servidorKefex.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origen no permitido por la política CORS.'));
}, credentials: true }));
servidorKefex.use(morgan("dev"));
servidorKefex.use(express.json({ limit: "1mb" }));
servidorKefex.use(express.urlencoded({ extended: true, limit: "1mb" }));

// API Endpoints
servidorKefex.use("/api/user", userRoutes);
servidorKefex.use("/api/admin", adminRoutes);
servidorKefex.use("/api/auth", authRoutes);
servidorKefex.use("/api/usuario", profileRoutes);
servidorKefex.use("/api/comments", commentsRoutes);
servidorKefex.use("/api/comments-for-you", commentsForYouRoutes);
servidorKefex.use("/api/opinions", opinionsRoutes);
servidorKefex.use("/api/sites", sitesRoutes);
servidorKefex.use("/api/search", searchRoutes);
servidorKefex.use("/api/productos", productoRoutes);
servidorKefex.use("/api/carrito", carritoRoutes);
servidorKefex.use("/api/usuarios", usuarioRoutes);
servidorKefex.use("/api/publicaciones", publicacionRoutes);
servidorKefex.use("/api/favoritos", favoritoRoutes);

servidorKefex.get("/", (_req, res) => res.status(200).json({ service: "KEFEX API", status: "ok" }));
servidorKefex.get("/api/health", (_req, res) => res.status(200).json({ status: "ok", timestamp: new Date().toISOString() }));

servidorKefex.use((error, _req, res, _next) => {
  const status = error?.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  const message = error?.message || 'Solicitud no válida.';
  return res.status(status).json({ error: message });
});

servidorKefex.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default servidorKefex;
