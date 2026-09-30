import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        correo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        contraseña: {
            type: String,
            required: true
        },

        foto: {
            type: String,
            default: null
        },

        ciudad: {
            type: String,
            trim: true,
            default: ""
        },

        biografia: {
            type: String,
            trim: true,
            default: ""
        },

        rol: {
            type: String,
            enum: ["usuario", "admin"],
            default: "usuario"
        },

        estado: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;