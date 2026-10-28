import jwt from 'jsonwebtoken';
import Usuario from '../Models/A-usuario.model.js';

export const autenticar = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Se requiere un token Bearer.' });
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'La autenticación no está configurada en el servidor.' });
    const decoded = jwt.verify(header.slice(7), secret);
    const user = await Usuario.findById(decoded.id).select('-password');
    if (!user || (user.estado && user.estado !== 'activo')) return res.status(401).json({ error: 'Usuario no válido o inactivo.' });
    req.usuario = user;
    req.auth = { id: user._id.toString(), rol: user.rol };
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

export const autorizarRoles = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.rol)) return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
  return next();
};
