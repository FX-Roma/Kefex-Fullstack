import mongoose from "mongoose";

const publicacionSchema = new mongoose.Schema(
    {
        autor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        contenido: {
            type: String,
            required: true,
            trim: true
        },

        multimedia: {
            type: String,
            default: null
        },

        categoria: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

publicacionSchema.index({ createdAt: -1, _id: -1 });
publicacionSchema.index({ categoria: 1, createdAt: -1 });

const Publicacion = mongoose.models.Publicacion || mongoose.model("Publicacion", publicacionSchema);

export default Publicacion;