import 'dotenv/config';
import servidorKefex from './server.js';
import { connectDatabase } from './connection.js';

const port = Number(process.env.PORT || 3005);
try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET debe configurarse con al menos 32 caracteres aleatorios.');
  await connectDatabase();
  const server = servidorKefex.listen(port, () => console.log(`KEFEX API disponible en http://localhost:${port}`));
  const shutdown = async (signal) => {
    console.log(`${signal}: cerrando KEFEX API...`);
    server.close(async () => { const mongoose = await import('mongoose'); await mongoose.default.disconnect(); process.exit(0); });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
} catch (error) {
  console.error('No fue posible iniciar KEFEX. Verifica la configuración y la conexión a MongoDB.');
  console.error(error instanceof Error ? error.message : 'Error desconocido');
  process.exit(1);
}
