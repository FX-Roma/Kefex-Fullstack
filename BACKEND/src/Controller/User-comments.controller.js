import ComentarioForo from '../Models/Comment.model.js';
import ForumOpinion from '../Models/Opinion.model.js';
const controllerComments = {
  createComment: async (req, res) => {
    try {
      const opinionId = req.body.opinionId;
      const texto = typeof req.body.texto === 'string' ? req.body.texto.trim() : '';
      if (!opinionId || !texto) return res.status(400).json({ result: 'error', message: 'opinionId and texto are required.' });
      const opinion = await ForumOpinion.findById(opinionId);
      if (!opinion) return res.status(404).json({ result: 'error', message: 'Discussion not found.' });
      const comment = await ComentarioForo.create({ opinion: opinion._id, texto, autor: { nombre: req.usuario.name, avatar: req.usuario.avatar || '', usuarioId: req.usuario._id } });
      opinion.commentsCount += 1; await opinion.save();
      return res.status(201).json({ result: 'fine', message: 'Comentario creado.', data: comment });
    } catch { return res.status(400).json({ result: 'error', message: 'No fue posible crear el comentario.' }); }
  },
  readAllComments: async (req, res) => {
    try { const filter = req.query.opinionId ? { opinion: req.query.opinionId } : {}; const data = await ComentarioForo.find(filter).sort({ createdAt: 1 }).lean(); return res.status(200).json({ result: 'fine', data }); }
    catch { return res.status(500).json({ result: 'error', message: 'No fue posible leer los comentarios.' }); }
  },
  readCommentByID: async (req, res) => {
    try { const data = await ComentarioForo.findById(req.params.id).lean(); return data ? res.status(200).json({ result: 'fine', data }) : res.status(404).json({ result: 'error', message: 'Comentario no encontrado.' }); }
    catch { return res.status(400).json({ result: 'error', message: 'ID de comentario no válido.' }); }
  },
  updateComment: async (req, res) => {
    try {
      const existing = await ComentarioForo.findById(req.params.id);
      if (!existing) return res.status(404).json({ result: 'error', message: 'Comentario no encontrado.' });
      if (existing.autor.usuarioId.toString() !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ result: 'error', message: 'No tienes permiso para editar este comentario.' });
      const texto = typeof req.body.texto === 'string' ? req.body.texto.trim() : '';
      if (!texto) return res.status(400).json({ result: 'error', message: 'El comentario no puede estar vacío.' });
      existing.texto = texto; await existing.save(); return res.status(200).json({ result: 'fine', data: existing });
    } catch { return res.status(400).json({ result: 'error', message: 'No fue posible actualizar el comentario.' }); }
  },
  deleteCommentByID: async (req, res) => {
    try {
      const existing = await ComentarioForo.findById(req.params.id);
      if (!existing) return res.status(404).json({ result: 'error', message: 'Comentario no encontrado.' });
      if (existing.autor.usuarioId.toString() !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ result: 'error', message: 'No tienes permiso para eliminar este comentario.' });
      await existing.deleteOne(); await ForumOpinion.findByIdAndUpdate(existing.opinion, { $inc: { commentsCount: -1 } });
      return res.status(200).json({ result: 'fine', message: 'Comentario eliminado.' });
    } catch { return res.status(400).json({ result: 'error', message: 'No fue posible eliminar el comentario.' }); }
  }
};
export default controllerComments;
