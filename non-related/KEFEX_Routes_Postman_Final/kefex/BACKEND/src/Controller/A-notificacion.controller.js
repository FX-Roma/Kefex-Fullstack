import Notificacion from "../Models/A-notificacion.model.js";


// Crear notificación
const crearNotificacion = async (req, res) => {
    try {
        const nuevaNotificacion = await Notificacion.create(req.body);

        res.status(201).json({
            mensaje: "Notificación creada correctamente",
            notificacion: nuevaNotificacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la notificación",
            error: error.message
        });
    }
};


// Obtener notificaciones de un usuario
const obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.find({
            usuario: req.params.usuarioId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            notificaciones
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las notificaciones",
            error: error.message
        });
    }
};


// Marcar notificación como leída
const marcarComoLeida = async (req, res) => {
    try {
        const notificacion = await Notificacion.findByIdAndUpdate(
            req.params.id,
            { leida: true },
            { new: true }
        );

        if (!notificacion) {
            return res.status(404).json({
                mensaje: "Notificación no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Notificación marcada como leída",
            notificacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la notificación",
            error: error.message
        });
    }
};


// Eliminar notificación
const eliminarNotificacion = async (req, res) => {
    try {
        const notificacion = await Notificacion.findByIdAndDelete(
            req.params.id
        );

        if (!notificacion) {
            return res.status(404).json({
                mensaje: "Notificación no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Notificación eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la notificación",
            error: error.message
        });
    }
};


export {
    crearNotificacion,
    obtenerNotificaciones,
    marcarComoLeida,
    eliminarNotificacion
};