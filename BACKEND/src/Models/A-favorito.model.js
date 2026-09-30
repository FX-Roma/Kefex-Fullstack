import mongoose from "mongoose";

const favoritoSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Favorito = mongoose.model("Favorito", favoritoSchema);

export default Favorito;