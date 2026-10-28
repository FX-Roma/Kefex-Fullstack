import mongoose from 'mongoose';
const comentarioForoSchema = new mongoose.Schema({
  opinion: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumOpinion', required: true, index: true },
  autor: { nombre: { type: String, required: true }, avatar: { type: String, default: '' }, usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true } },
  texto: { type: String, required: true, trim: true, maxlength: 3000 },
  likes: { type: Number, default: 0, min: 0 }
}, { timestamps: true, versionKey: false });
export default mongoose.models.ComentarioForo || mongoose.model('ComentarioForo', comentarioForoSchema);
