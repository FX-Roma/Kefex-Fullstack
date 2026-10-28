import mongoose from 'mongoose';

const commentForYouSchema = new mongoose.Schema({
  autor: {
    nombre: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  },
  publicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion', default: null, index: true },
  opinion: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumOpinion', default: null, index: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', default: null, index: true },
  texto: { type: String, required: true, trim: true, maxlength: 3000 },
  likes: { type: Number, default: 0, min: 0 },
}, { timestamps: true, versionKey: false });

export default mongoose.models.CommentForYou || mongoose.model('CommentForYou', commentForYouSchema);
