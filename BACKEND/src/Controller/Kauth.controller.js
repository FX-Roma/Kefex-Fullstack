import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../Models/A-usuario.model.js";

const generarToken = (usuario) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está configurado en las variables de entorno");
  }

  return jwt.sign(
    {
      id: usuario._id.toString(),
      username: usuario.username,
      rol: usuario.rol,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const usuarioSeguro = (usuario) => ({
  id: usuario._id,
  nombre: usuario.nombre,
  username: usuario.username,
  correo: usuario.correo,
  foto: usuario.foto,
  ciudad: usuario.ciudad,
  biografia: usuario.biografia,
  rol: usuario.rol,
  estado: usuario.estado,
});

export const register = async (req, res) => {
  try {
    const {
      nombre,
      username,
      correo,
      contraseña,
      contrasena,
      foto,
      ciudad,
      biografia,
      rol,
    } = req.body;

    const password = contraseña ?? contrasena;

    if (!nombre || !username || !correo || !password) {
      return res.status(400).json({
        mensaje: "nombre, username, correo y contraseña son obligatorios",
      });
    }

    const existe = await Usuario.findOne({
      $or: [
        { correo: correo.toLowerCase().trim() },
        { username: username.trim() },
      ],
    });

    if (existe) {
      return res.status(409).json({
        mensaje: "El correo o username ya están registrados",
      });
    }

    const hash = await bcrypt.hash(password, 12);

    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      username: username.trim(),
      correo: correo.toLowerCase().trim(),
      contraseña: hash,
      foto,
      ciudad,
      biografia,
      rol: rol === "admin" ? "admin" : "usuario",
    });

    const token = generarToken(usuario);

    return res.status(201).json({
      mensaje: "Registro exitoso",
      token,
      usuario: usuarioSeguro(usuario),
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al registrar el usuario",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identificador, correo, username, contraseña, contrasena } = req.body;
    const loginId = identificador || correo || username;
    const password = contraseña ?? contrasena;

    if (!loginId || !password) {
      return res.status(400).json({
        mensaje: "Se requiere correo/username y contraseña",
      });
    }

    const usuario = await Usuario.findOne({
      $or: [
        { correo: loginId.toLowerCase().trim() },
        { username: loginId.trim() },
      ],
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    if (!usuario.estado) {
      return res.status(403).json({ mensaje: "La cuenta está inactiva" });
    }

    const coincide = await bcrypt.compare(password, usuario.contraseña);

    if (!coincide) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = generarToken(usuario);

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: usuarioSeguro(usuario),
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

export const verificarToken = async (req, res) => {
  return res.status(200).json({
    mensaje: "Token válido",
    usuario: usuarioSeguro(req.usuario),
  });
};

export const perfil = verificarToken;