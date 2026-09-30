import ComentarioForo from "../Models/K-commentsForYouModule.js";

const controllerComments = {
  createComment: async (req, res) => {
    try {
      const newComment = await ComentarioForo.create({
        autor: {
          nombre: req.body.nombre || "Usuario Anónimo",
          avatar: req.body.avatar || "https://i.pravatar.cc/150",
          usuarioId: req.body.usuarioId,
        },
        texto: req.body.texto,
        likes: req.body.likes || 0,
        publicacion: req.body.publicacion || null,
        opinion: req.body.opinion || null,
        producto: req.body.producto || null,
      });

      return res.status(201).json({
        result: "fine",
        message: "Comentario creado con éxito",
        data: newComment,
      });
    } catch (error) {
      return res.status(400).json({
        result: "mistake",
        message: "Error al crear el comentario",
        data: error.message,
      });
    }
  },

  readAllComments: async (req, res) => {
    try {
      const filtro = {};
      if (req.query.publicacion) filtro.publicacion = req.query.publicacion;
      if (req.query.opinion) filtro.opinion = req.query.opinion;
      if (req.query.producto) filtro.producto = req.query.producto;

      const comments = await ComentarioForo.find(filtro).sort({ createdAt: -1 });

      return res.status(200).json({
        result: "fine",
        message: "Comentarios leídos con éxito",
        data: comments,
      });
    } catch (error) {
      return res.status(500).json({
        result: "mistake",
        message: "Error al leer los comentarios",
        data: error.message,
      });
    }
  },

  readCommentByID: async (req, res) => {
    try {
      const comment = await ComentarioForo.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({
          result: "mistake",
          message: "Comentario no encontrado",
        });
      }

      return res.status(200).json({
        result: "fine",
        message: "Comentario encontrado",
        data: comment,
      });
    } catch (error) {
      return res.status(400).json({
        result: "mistake",
        message: "ID de comentario inválido",
        data: error.message,
      });
    }
  },

  updateComment: async (req, res) => {
    try {
      const commentUpdated = await ComentarioForo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!commentUpdated) {
        return res.status(404).json({
          result: "mistake",
          message: "Comentario no encontrado",
        });
      }

      return res.status(200).json({
        result: "fine",
        message: "Comentario actualizado correctamente",
        data: commentUpdated,
      });
    } catch (error) {
      return res.status(400).json({
        result: "mistake",
        message: "Error al actualizar el comentario",
        data: error.message,
      });
    }
  },

  deleteCommentByID: async (req, res) => {
    try {
      const commentDeleted = await ComentarioForo.findByIdAndDelete(req.params.id);

      if (!commentDeleted) {
        return res.status(404).json({
          result: "mistake",
          message: "Comentario no encontrado",
        });
      }

      return res.status(200).json({
        result: "fine",
        message: "Comentario eliminado correctamente",
      });
    } catch (error) {
      return res.status(400).json({
        result: "mistake",
        message: "Error al eliminar el comentario",
        data: error.message,
      });
    }
  },
};

export default controllerComments;
