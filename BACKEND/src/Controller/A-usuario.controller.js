import bcrypt from "bcryptjs";
import Usuario from "../Models/A-usuario.model.js";

const crearUsuario = async (req, res) => {
    try {
        const {
            nombre,
            username,
            correo,
            contraseña,
            contrasena,
            foto,
            ciudad,
            biografia,
            rol
        } = req.body;

        const password = contraseña ?? contrasena;

        if (!nombre || !username || !correo || !password) {
            return res.status(400).json({
                mensaje: "nombre, username, correo y contraseña son obligatorios"
            });
        }

        // Verificar duplicados
        const existe = await Usuario.findOne({
            $or: [
                { correo: correo.toLowerCase().trim() },
                { username: username.trim() }
            ]
        });

        if (existe) {
            return res.status(409).json({
                mensaje: "El correo o username ya están registrados"
            });
        }

        const hash = await bcrypt.hash(password, 12);

        const nuevoUsuario = await Usuario.create({
            nombre: nombre.trim(),
            username: username.trim(),
            correo: correo.toLowerCase().trim(),
            contraseña: hash,
            foto: foto || null,
            ciudad: ciudad || "",
            biografia: biografia || "",
            rol: rol === "admin" ? "admin" : "usuario"
        });

        // Omitir la contraseña en la respuesta
        const usuarioRespuesta = nuevoUsuario.toObject();
        delete usuarioRespuesta.contraseña;

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: usuarioRespuesta
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el usuario",
            error: error.message
        });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-contraseña");

        res.status(200).json({
            usuarios
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-contraseña");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            usuario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el usuario",
            error: error.message
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const datosActualizar = { ...req.body };

        // Manejar contraseña si se envía en la actualización
        const password = datosActualizar.contraseña ?? datosActualizar.contrasena;
        if (password) {
            datosActualizar.contraseña = await bcrypt.hash(password, 12);
            delete datosActualizar.contrasena;
        }

        if (datosActualizar.correo) {
            datosActualizar.correo = datosActualizar.correo.toLowerCase().trim();
        }

        if (datosActualizar.username) {
            datosActualizar.username = datosActualizar.username.trim();
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            datosActualizar,
            {
                new: true,
                runValidators: true
            }
        ).select("-contraseña");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            usuario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el usuario",
            error: error.message
        });
    }
};

export {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};