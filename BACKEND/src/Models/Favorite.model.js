import mongoose from 'mongoose';
const favoritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', default: null },
  publicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion', default: null }
}, { timestamps: true, versionKey: false });
favoritoSchema.index({ usuario: 1, producto: 1 }, { unique: true, partialFilterExpression: { producto: { $type: 'objectId' } } });
favoritoSchema.index({ usuario: 1, publicacion: 1 }, { unique: true, partialFilterExpression: { publicacion: { $type: 'objectId' } } });
favoritoSchema.pre('validate', function(next) { if (!this.producto && !this.publicacion) return next(new Error('Se requiere producto o publicación.')); return next(); });
export default mongoose.models.Favorito || mongoose.model('Favorito', favoritoSchema);
