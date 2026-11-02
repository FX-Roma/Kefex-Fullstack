import Usuario from '../Models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer'

const createToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no está configurado.');
  return jwt.sign({ id: user._id.toString(), name: user.name, email: user.email, rol: user.rol }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
};

// Generar contraseña temporal aleatoria
function generarContrasenaAleatoria() {
  return randomBytes(6).toString('hex');
}

// Configurar el correo desde el cual KEFEX enviará mensajes
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_NODE,
    pass: process.env.PASS_NODE
  }
});

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

// Recuperar contraseña
export const forgotPassword = async (req, res) => {
  try {
    // 1. Recibir el correo enviado por el usuario
    const { email } = req.body;

    // 2. Verificar que haya ingresado un correo
    if (typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        result: 'mal',
        message: 'El correo electrónico es obligatorio.'
      });
    }

    // 3. Buscar el usuario en MongoDB
    const user = await Usuario.findOne({
      email: email.trim().toLowerCase()
    });
  
    // 4. Responder sin revelar si el correo existe
    if (!user) {
      return res.status(200).json({
        result: 'fine',
        message: 'Si el correo está registrado, recibirás instrucciones de recuperación.'
      });
    }

    // 5. Generar una contraseña temporal
    const newPass = generarContrasenaAleatoria();

    // 6. Encriptar la contraseña con bcrypt
    const hashPassword = await bcrypt.hash(newPass, 12);

    // 7. Preparar el correo electrónico
const mailOptions = {
  from: process.env.EMAIL_NODE,
  to: user.email,
  subject: 'KEFEX - Recuperación de contraseña',
  text: `Hola ${user.name},

Recibimos una solicitud para recuperar tu contraseña de KEFEX.

Tu nueva contraseña temporal es: ${newPass}

Inicia sesión con esta contraseña y cámbiala lo antes posible.

Si no solicitaste este cambio, contacta al administrador de KEFEX.

Equipo KEFEX`
};

// 8. Enviar la contraseña temporal al correo
await transporter.sendMail(mailOptions);

// 9. Guardar la nueva contraseña cifrada en MongoDB
user.password = hashPassword;
await user.save();

// 10. Responder al frontend o a Postman
return res.status(200).json({
  result: 'fine',
  message: 'Si el correo está registrado, recibirás instrucciones de recuperación.'
});

  } catch (error) {
    console.error('Error al recuperar la contraseña:', error);

    return res.status(500).json({
      result: 'mal',
      message: 'Error interno en el servidor.'
    });
  }
};

// Cambiar contraseña del usuario autenticado
export const cambiarPassword = async (req, res) => {
  try {
    // 1. Recibir las contraseñas
    const { passwordActual, passwordNueva } = req.body;

    // 2. Validar los datos recibidos
    if (
      typeof passwordActual !== 'string' ||
      typeof passwordNueva !== 'string' ||
      passwordNueva.length < 8
    ) {
      return res.status(400).json({
        result: 'mal',
        message: 'Debes ingresar la contraseña actual y una nueva de mínimo 8 caracteres.'
      });
    }

    // 3. Buscar al usuario autenticado
    const user = await Usuario.findById(req.auth.id).select('+password');

    if (!user) {
      return res.status(404).json({
        result: 'mal',
        message: 'Usuario no encontrado.'
      });
    }

    // 4. Comprobar la contraseña actual
    const esValida = await bcrypt.compare(passwordActual, user.password);

    if (!esValida) {
      return res.status(401).json({
        result: 'mal',
        message: 'La contraseña actual es incorrecta.'
      });
    }

    // 5. Evitar reutilizar la misma contraseña
    if (await bcrypt.compare(passwordNueva, user.password)) {
      return res.status(400).json({
        result: 'mal',
        message: 'La nueva contraseña debe ser diferente a la actual.'
      });
    }

    // 6. Cifrar y guardar la nueva contraseña
    user.password = await bcrypt.hash(passwordNueva, 12);
    await user.save();

    // 7. Confirmar el cambio
    return res.status(200).json({
      result: 'fine',
      message: 'Contraseña actualizada correctamente.'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);

    return res.status(500).json({
      result: 'mal',
      message: 'No fue posible cambiar la contraseña.'
    });
  }
};