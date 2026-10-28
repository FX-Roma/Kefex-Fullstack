import CommentForYou from '../Models/CommentForYou.model.js';

const controller = {
  createComment: async (req, res) => {
    try {
      const texto = typeof req.body.texto === 'string' ? req.body.texto.trim() : '';
      if (!texto) return res.status(400).json({ result: 'error', message: 'texto is required.' });
      const comment = await CommentForYou.create({
        autor: { nombre: req.usuario.name, avatar: req.usuario.avatar || '', usuarioId: req.usuario._id },
        texto,
        publicacion: req.body.publicacion || null,
        opinion: req.body.opinion || null,
        producto: req.body.producto || null,
      });
      return res.status(201).json({ result: 'fine', data: comment });
    } catch { return res.status(400).json({ result: 'error', message: 'Could not create comment.' }); }
  },
  readAllComments: async (req, res) => {
    try {
      const filter = {};
      for (const key of ['publicacion', 'opinion', 'producto']) if (req.query[key]) filter[key] = req.query[key];
      const comments = await CommentForYou.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ result: 'fine', data: comments });
    } catch { return res.status(500).json({ result: 'error', message: 'Could not read comments.' }); }
  },
  readCommentByID: async (req, res) => {
    try {
      const comment = await CommentForYou.findById(req.params.id);
      return comment ? res.status(200).json({ result: 'fine', data: comment }) : res.status(404).json({ result: 'error', message: 'Comment not found.' });
    } catch { return res.status(400).json({ result: 'error', message: 'Invalid comment ID.' }); }
  },
  updateComment: async (req, res) => {
    try {
      const comment = await CommentForYou.findById(req.params.id);
      if (!comment) return res.status(404).json({ result: 'error', message: 'Comment not found.' });
      if (comment.autor.usuarioId.toString() !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ result: 'error', message: 'Not allowed to update this comment.' });
      const texto = typeof req.body.texto === 'string' ? req.body.texto.trim() : '';
      if (!texto) return res.status(400).json({ result: 'error', message: 'texto cannot be empty.' });
      comment.texto = texto;
      await comment.save();
      return res.status(200).json({ result: 'fine', data: comment });
    } catch { return res.status(400).json({ result: 'error', message: 'Could not update comment.' }); }
  },
  deleteCommentByID: async (req, res) => {
    try {
      const comment = await CommentForYou.findById(req.params.id);
      if (!comment) return res.status(404).json({ result: 'error', message: 'Comment not found.' });
      if (comment.autor.usuarioId.toString() !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ result: 'error', message: 'Not allowed to delete this comment.' });
      await comment.deleteOne();
      return res.status(200).json({ result: 'fine', message: 'Comment deleted.' });
    } catch { return res.status(400).json({ result: 'error', message: 'Could not delete comment.' }); }
  },
};
export default controller;
