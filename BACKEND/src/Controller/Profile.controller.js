import Usuario from '../Models/User.model.js';

export const obtenerPerfil = async (req, res) => res.status(200).json({ user: {
  id: req.usuario._id.toString(), name: req.usuario.name, email: req.usuario.email,
  rol: req.usuario.rol, avatar: req.usuario.avatar, biografia: req.usuario.biografia,
  createdAt: req.usuario.createdAt
} });

export const actualizarPerfil = async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.name === 'string') update.name = req.body.name.trim();
    if (typeof req.body.avatar === 'string') update.avatar = req.body.avatar.trim();
    if (typeof req.body.biografia === 'string') update.biografia = req.body.biografia.trim();
    if (update.name !== undefined && !update.name) return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    if (update.biografia && update.biografia.length > 280) return res.status(400).json({ error: 'La biografía no puede superar 280 caracteres.' });
    const user = await Usuario.findByIdAndUpdate(req.auth.id, update, { new: true, runValidators: true }).select('-password').lean();
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    return res.status(200).json({ message: 'Perfil actualizado.', user: {
      id: user._id.toString(), name: user.name, email: user.email, rol: user.rol,
      avatar: user.avatar, biografia: user.biografia, createdAt: user.createdAt
    } });
  } catch { return res.status(400).json({ error: 'No fue posible actualizar el perfil.' }); }
};

export const listarUsuariosAdmin = async (_req, res) => {
  const users = await Usuario.find().select('name email rol estado avatar createdAt').sort({ createdAt: -1 }).lean();
  return res.status(200).json({ users });
};
