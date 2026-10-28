import mongoose from 'mongoose';
export async function connectDatabase() {
  const uri = process.env.KEFEX;
  if (!uri) throw new Error('La variable KEFEX (MongoDB connection URI) no está configurada.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB conectado correctamente.');
}
