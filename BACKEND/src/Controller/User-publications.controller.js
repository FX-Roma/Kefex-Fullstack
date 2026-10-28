import Publicacion from "../Models/Publication.model.js";

// Crear una publicación
const crearPublicacion = async (req, res) => {
    try {
        const contenido = typeof req.body.contenido === 'string' ? req.body.contenido.trim() : '';
        const categoria = typeof req.body.categoria === 'string' ? req.body.categoria.trim() : '';
        if (!contenido || !categoria) return res.status(400).json({ mensaje: 'contenido y categoria son obligatorios' });
        const nuevaPublicacion = await Publicacion.create({ autor: req.auth.id, contenido, categoria, multimedia: req.file ? `/uploads/${req.file.filename}` : (req.body.multimedia || null) });

        res.status(201).json({
            mensaje: "Publicación creada correctamente",
            publicacion: nuevaPublicacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la publicación",
            error: error.message
        });
    }
};


// Obtener todas las publicaciones
const obtenerPublicaciones = async (req, res) => {
    try {
        const filter = {};
        if (typeof req.query.categoria === 'string' && req.query.categoria.trim()) filter.categoria = req.query.categoria.trim();
        if (typeof req.query.q === 'string' && req.query.q.trim()) filter.contenido = { $regex: req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
        const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
        const limit = Math.min(50, Math.max(1, Number.parseInt(String(req.query.limit || '20'), 10) || 20));
        const publicaciones = await Publicacion.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("autor", "name email avatar");
        res.status(200).json({ publicaciones, page, limit });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las publicaciones",
            error: error.message
        });
    }
};


// Obtener una publicación por ID
const obtenerPublicacionPorId = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id)
            .populate("autor", "name email avatar");

        if (!publicacion) {
            return res.status(404).json({
                mensaje: "Publicación no encontrada"
            });
        }

        res.status(200).json({
            publicacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener la publicación",
            error: error.message
        });
    }
};


// Actualizar una publicación
const actualizarPublicacion = async (req, res) => {
    try {
        const existing = await Publicacion.findById(req.params.id);
        if (!existing) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        if (existing.autor.toString() !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ mensaje: "No tienes permisos para editar esta publicación" });
        const update = {};
        if (typeof req.body.contenido === 'string') update.contenido = req.body.contenido.trim();
        if (typeof req.body.categoria === 'string') update.categoria = req.body.categoria.trim();
        if (req.body.multimedia !== undefined) update.multimedia = req.body.multimedia;
        const publicacion = await Publicacion.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });

        if (!publicacion) {
            return res.status(404).json({
                mensaje: "Publicación no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Publicación actualizada correctamente",
            publicacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la publicación",
            error: error.message
        });
    }
};


// Eliminar una publicación
const eliminarPublicacion = async (req, res) => {
    try {
        const existing = await Publicacion.findById(req.params.id);
        if (!existing) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        if (existing.autor.toString() !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ mensaje: "No tienes permisos para eliminar esta publicación" });
        const publicacion = await existing.deleteOne();

        if (!publicacion) {
            return res.status(404).json({
                mensaje: "Publicación no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Publicación eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la publicación",
            error: error.message
        });
    }
};


export {
    crearPublicacion,
    obtenerPublicaciones,
    obtenerPublicacionPorId,
    actualizarPublicacion,
    eliminarPublicacion
};