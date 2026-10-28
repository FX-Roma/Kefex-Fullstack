import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import productoRoutes from "./Routes/Admin-products.routes.js";
import carritoRoutes from "./Routes/User-cart.routes.js";
import authRoutes from "./Routes/Auth.routes.js";
import usuarioRoutes from "./Routes/Admin-users.routes.js";
import publicacionRoutes from "./Routes/User-publications.routes.js";
import favoritoRoutes from "./Routes/User-favorites.routes.js";
import commentsRoutes from "./Routes/User-comments.routes.js";
import commentsForYouRoutes from "./Routes/User-comments-for-you.routes.js";
import opinionsRoutes from "./Routes/User-opinions.routes.js";
import sitesRoutes from "./Routes/Admin-sites.routes.js";
import searchRoutes from "./Routes/Search.routes.js";
import profileRoutes from "./Routes/Profile.routes.js";

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
