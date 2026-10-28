import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        mensaje: {
            type: String,
            required: true,
            trim: true
        },

        tipo: {
            type: String,
            enum: ["sistema", "publicacion", "producto", "general"],
            default: "general"
        },

        leida: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Notificacion = mongoose.model(
    "Notificacion",
    notificacionSchema
);

export default Notificacion;