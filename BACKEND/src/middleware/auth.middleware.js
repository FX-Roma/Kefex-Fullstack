import jwt from 'jsonwebtoken';
import Usuario from '../Models/User.model.js';

/**
 * Authenticate either a local Postman development request explicitly marked with
 * X-Dev-Role, or a normal request carrying a valid JWT. The bypass must never
 * override a frontend session token merely because the env flag is enabled.
 */
export const autenticar = async (req, res, next) => {
  try {
    const requestedRole = req.get('x-dev-role');
    const bypassEnabled = process.env.POSTMAN_AUTH_BYPASS === 'true';

    // Only an explicit role header opts into the Postman-only bypass.
    if (requestedRole && bypassEnabled) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Postman auth bypass is disabled in production.' });
      }
      if (!['user', 'admin'].includes(requestedRole)) {
        return res.status(400).json({ error: 'X-Dev-Role must be either user or admin.' });
      }

      const emailVariable = requestedRole === 'admin'
        ? 'POSTMAN_DEV_ADMIN_EMAIL'
        : 'POSTMAN_DEV_USER_EMAIL';
      const email = process.env[emailVariable];
      if (!email) {
        return res.status(503).json({ error: `Configure ${emailVariable} to use local Postman auth bypass.` });
      }

      const devUser = await Usuario.findOne({ email: email.toLowerCase().trim() }).select('-password');
      if (!devUser || devUser.estado !== 'activo' || devUser.rol !== requestedRole) {
        return res.status(401).json({ error: `Configured ${requestedRole} account was not found, is inactive, or has the wrong role.` });
      }

      req.usuario = devUser;
      req.auth = { id: devUser._id.toString(), rol: devUser.rol };
      return next();
    }

    // No explicit Postman bypass request: use normal JWT authentication,
    // even when POSTMAN_AUTH_BYPASS=true for the developer's local machine.
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Se requiere un token Bearer.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'La autenticación no está configurada en el servidor.' });
    }

    const decoded = jwt.verify(header.slice(7), secret);
    const user = await Usuario.findById(decoded.id).select('-password');
    if (!user || (user.estado && user.estado !== 'activo')) {
      return res.status(401).json({ error: 'Usuario no válido o inactivo.' });
    }

    req.usuario = user;
    req.auth = { id: user._id.toString(), rol: user.rol };
    return next();
  } catch (error) {
    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError' || error?.name === 'NotBeforeError') {
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
    console.error('[AUTH] Authentication middleware failed:', error);
    return res.status(500).json({ error: 'No fue posible validar la autenticación.' });
  }
};

export const autorizarRoles = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
  }
  return next();
};
