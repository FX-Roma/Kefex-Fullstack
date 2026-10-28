import Usuario from '../Models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no está configurado.');
  return jwt.sign({ id: user._id.toString(), name: user.name, email: user.email, rol: user.rol }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
};

export const registro = async (req, res) => {
  try {
    const name =
      typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email =
      typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const password =
      typeof req.body.password === 'string' ? req.body.password : '';

    if (!name || !email || password.length < 8) {
      return res.status(400).json({
        result: 'mal',
        message:
          'Nombre, correo y contraseña (mínimo 8 caracteres) son obligatorios.'
      });
    }

    if (await Usuario.exists({ email })) {
      return res.status(409).json({
        result: 'mal',
        message: 'El correo electrónico ya está registrado.'
      });
    }

    const user = await Usuario.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      rol: 'user'
    });

    return res.status(201).json({
      result: 'fine',
      message: 'Cuenta creada correctamente.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    if (error?.code === 11000) {
      console.error('[REGISTER] Duplicate-key error:', error.keyPattern);

      return res.status(409).json({
        result: 'mal',
        message: 'El correo electrónico ya está registrado.'
      });
    }

    console.error('[REGISTER] Registration error:', error);

    return res.status(500).json({
      result: 'mal',
      message: 'No fue posible registrar la cuenta.'
    });
  }
};

const loginForRole = (expectedRole) => async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!username || !password) return res.status(400).json({ result: 'mal', message: 'Correo y contraseña son obligatorios.' });
    const user = await Usuario.findOne({ email: username }).select('+password');
    if (!user || (user.estado && user.estado !== 'activo') || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ result: 'mal', message: 'Credenciales inválidas.' });
    }
    if (expectedRole && user.rol !== expectedRole) return res.status(403).json({ result: 'mal', message: 'Esta cuenta no puede acceder a este flujo.' });
    const token = createToken(user);
    return res.status(200).json({ result: 'fine', message: `Bienvenido ${user.name}.`, data: token, user: { id: user._id.toString(), name: user.name, email: user.email, rol: user.rol } });
  } catch {
    return res.status(500).json({ result: 'mal', message: 'Ocurrió un error al iniciar sesión.' });
  }
};

export const iniciarSesion = loginForRole(null);
export const iniciarSesionUsuario = loginForRole('user');
export const iniciarSesionAdmin = loginForRole('admin');
