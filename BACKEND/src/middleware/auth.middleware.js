import jwt from 'jsonwebtoken';
import Usuario from '../Models/User.model.js';

export const autenticar = async (req, res, next) => {
  try {
    // Local Postman convenience only: uses a real MongoDB account and never runs in production.
    if (process.env.POSTMAN_AUTH_BYPASS === 'true') {
      if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Postman auth bypass is disabled in production.' });
      const requestedRole = req.get('x-dev-role') === 'admin' ? 'admin' : 'user';
      const emailVariable = requestedRole === 'admin' ? 'POSTMAN_DEV_ADMIN_EMAIL' : 'POSTMAN_DEV_USER_EMAIL';
      const email = process.env[emailVariable];
      if (!email) return res.status(503).json({ error: `Configure ${emailVariable} to use local Postman auth bypass.` });
      const devUser = await Usuario.findOne({ email: email.toLowerCase().trim() }).select('-password');
      if (!devUser || devUser.estado !== 'activo' || devUser.rol !== requestedRole) return res.status(401).json({ error: `Configured ${requestedRole} account was not found, is inactive, or has the wrong role.` });
      req.usuario = devUser;
      req.auth = { id: devUser._id.toString(), rol: devUser.rol };
      return next();
    }
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
