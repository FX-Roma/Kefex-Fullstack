import Favorito from '../Models/A-favorito.model.js';
export const agregarFavorito = async (req, res) => {
  try {
    const publicacion = req.body.publicacionId;
    const producto = req.body.productoId;
    if (!publicacion && !producto) return res.status(400).json({ mensaje: 'publicacionId o productoId es obligatorio.' });
    const filter = { usuario: req.auth.id, ...(publicacion ? { publicacion } : { producto }) };
    const favorito = await Favorito.findOneAndUpdate(filter, { $setOnInsert: filter }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return res.status(201).json({ favorito });
  } catch (error) { if (error?.code === 11000) return res.status(200).json({ mensaje: 'El favorito ya existe.' }); return res.status(400).json({ mensaje: 'No fue posible agregar el favorito.' }); }
};
export const obtenerFavoritos = async (req, res) => {
  try { const favoritos = await Favorito.find({ usuario: req.auth.id }).populate('producto').populate({ path: 'publicacion', populate: { path: 'autor', select: 'name email avatar' } }).sort({ createdAt: -1 }); return res.status(200).json({ favoritos }); }
  catch { return res.status(500).json({ mensaje: 'No fue posible obtener los favoritos.' }); }
};
export const obtenerFavoritosPorUsuario = async (req, res) => {
  if (req.params.usuarioId !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ mensaje: 'No tienes permiso para ver estos favoritos.' });
  try { const favoritos = await Favorito.find({ usuario: req.params.usuarioId }).populate('producto').populate('publicacion'); return res.status(200).json({ favoritos }); }
  catch { return res.status(500).json({ mensaje: 'No fue posible obtener los favoritos.' }); }
};
export const eliminarFavorito = async (req, res) => {
  try { const favorito = await Favorito.findOneAndDelete({ _id: req.params.id, ...(req.auth.rol === 'admin' ? {} : { usuario: req.auth.id }) }); return favorito ? res.status(200).json({ mensaje: 'Favorito eliminado.' }) : res.status(404).json({ mensaje: 'Favorito no encontrado.' }); }
  catch { return res.status(400).json({ mensaje: 'Identificador de favorito no válido.' }); }
};
