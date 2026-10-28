import mongoose from 'mongoose';

const commentsForYouSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publicacion',
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
    calificacion: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Patrón defensivo Mongoose: Evita el OverwriteModelError usando el caché global
const ComentarioForo =
  mongoose.models.ComentarioForo ||
  mongoose.model('ComentarioForo', commentsForYouSchema);

export default ComentarioForo;