import Favorito from "../Models/A-favorito.model.js";


// Agregar producto a favoritos
const agregarFavorito = async (req, res) => {
    try {
        const nuevoFavorito = await Favorito.create(req.body);

        res.status(201).json({
            mensaje: "Producto agregado a favoritos",
            favorito: nuevoFavorito
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al agregar el favorito",
            error: error.message
        });
    }
};


// Obtener todos los favoritos
const obtenerFavoritos = async (req, res) => {
    try {
        const favoritos = await Favorito.find()
            .populate("usuario", "nombre username")
            .populate("producto");

        res.status(200).json({
            favoritos
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los favoritos",
            error: error.message
        });
    }
};


// Obtener favoritos de un usuario
const obtenerFavoritosPorUsuario = async (req, res) => {
    try {
        const favoritos = await Favorito.find({
            usuario: req.params.usuarioId
        }).populate("producto");

        res.status(200).json({
            favoritos
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los favoritos del usuario",
            error: error.message
        });
    }
};


// Eliminar un favorito
const eliminarFavorito = async (req, res) => {
    try {
        const favorito = await Favorito.findByIdAndDelete(req.params.id);

        if (!favorito) {
            return res.status(404).json({
                mensaje: "Favorito no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado de favoritos"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el favorito",
            error: error.message
        });
    }
};


export {
    agregarFavorito,
    obtenerFavoritos,
    obtenerFavoritosPorUsuario,
    eliminarFavorito
};