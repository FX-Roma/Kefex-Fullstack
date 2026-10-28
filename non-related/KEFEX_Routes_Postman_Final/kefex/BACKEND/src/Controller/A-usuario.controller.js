import bcrypt from 'bcryptjs';
import Usuario from '../Models/A-usuario.model.js';

export const crearUsuario = async (req, res, allowedRoles = ['user']) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const requestedRole = typeof req.body.rol === 'string' ? req.body.rol : 'user';
    if (!allowedRoles.includes(requestedRole)) return res.status(400).json({ message: `rol debe ser uno de: ${allowedRoles.join(', ')}.` });
    if (!name || !email || password.length < 8) return res.status(400).json({ message: 'name, email y password (mínimo 8 caracteres) son obligatorios.' });
    if (await Usuario.exists({ email })) return res.status(409).json({ message: 'El correo ya está registrado.' });
    const user = await Usuario.create({ name, email, password: await bcrypt.hash(password, 12), rol: requestedRole });
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, rol: user.rol } });
  } catch (error) { return res.status(500).json({ message: 'No fue posible crear el usuario.' }); }
};
export const crearUsuarioAdmin = (req, res) => crearUsuario(req, res, ['user', 'admin']);

export const obtenerUsuarios = async (_req, res) => {
  try { return res.status(200).json({ usuarios: await Usuario.find().select('-password').sort({ createdAt: -1 }).lean() }); }
  catch { return res.status(500).json({ message: 'No fue posible obtener los usuarios.' }); }
};
export const obtenerUsuarioPorId = async (req, res) => {
  try { const user = await Usuario.findById(req.params.id).select('-password').lean(); return user ? res.status(200).json({ usuario: user }) : res.status(404).json({ message: 'Usuario no encontrado.' }); }
  catch { return res.status(400).json({ message: 'ID de usuario no válido.' }); }
};
export const actualizarUsuario = async (req, res) => {
  try {
    const update = {};
    for (const key of ['name', 'avatar', 'biografia', 'estado', 'rol']) if (req.body[key] !== undefined) update[key] = req.body[key];
    if (req.body.email) update.email = String(req.body.email).trim().toLowerCase();
    if (req.body.password) update.password = await bcrypt.hash(String(req.body.password), 12);
    // Public requests must never promote a user to administrator.
    const user = await Usuario.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password').lean();
    return user ? res.status(200).json({ usuario: user }) : res.status(404).json({ message: 'Usuario no encontrado.' });
  } catch { return res.status(400).json({ message: 'No fue posible actualizar el usuario.' }); }
};
export const eliminarUsuario = async (req, res) => {
  try { const user = await Usuario.findByIdAndDelete(req.params.id); return user ? res.status(200).json({ message: 'Usuario eliminado.' }) : res.status(404).json({ message: 'Usuario no encontrado.' }); }
  catch { return res.status(400).json({ message: 'ID de usuario no válido.' }); }
};
