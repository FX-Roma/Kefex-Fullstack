import jwt from "jsonwebtoken";
import Usuario from "../Models/A-usuario.model.js";

export const autenticar = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Se requiere un token Bearer",
      });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).select("-contraseña");

    if (!usuario || !usuario.estado) {
      return res.status(401).json({
        mensaje: "Usuario no válido o inactivo",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado",
      error: error.message,
    });
  }
};
