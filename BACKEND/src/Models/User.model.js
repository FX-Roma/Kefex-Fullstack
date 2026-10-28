import mongoose from 'mongoose';
const usuarioSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  rol: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  biografia: { type: String, default: '', maxlength: 280 },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true, versionKey: false });
const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
export default Usuario;
