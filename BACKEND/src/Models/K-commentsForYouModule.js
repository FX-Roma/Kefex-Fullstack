import mongoose from "mongoose";

const comentarioForoSchema = new mongoose.Schema(
  {
    autor: {
      nombre: { type: String, required: true, trim: true },
      avatar: { type: String, default: "https://i.pravatar.cc/150" },
      usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
    },
    texto: {
      type: String,
      required: [true, "El contenido del comentario no puede estar vacío"],
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publicacion",
      default: null,
    },
    opinion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumOpinion",
      default: null,
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ComentarioForo", comentarioForoSchema);
