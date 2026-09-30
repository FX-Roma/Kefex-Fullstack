import { Router } from "express";
import {
  register,
  login,
  verificarToken,
  perfil,
} from "../Controller/Kauth.controller.js";
import { autenticar } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", autenticar, verificarToken);
router.get("/me", autenticar, perfil);

export default router;
