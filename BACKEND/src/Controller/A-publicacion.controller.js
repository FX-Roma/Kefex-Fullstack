import Publicacion from "../Models/A-publicacion.model.js";

// Crear una publicación
const crearPublicacion = async (req, res) => {
    try {
        const nuevaPublicacion = await Publicacion.create(req.body);

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
        const publicaciones = await Publicacion.find()
            .populate("autor", "nombre username foto");

        res.status(200).json({
            publicaciones
        });

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
            .populate("autor", "nombre username foto");

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
        const publicacion = await Publicacion.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

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
        const publicacion = await Publicacion.findByIdAndDelete(req.params.id);

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