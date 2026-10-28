import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        descripcion: {
            type: String,
            trim: true,
            default: ""
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

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;