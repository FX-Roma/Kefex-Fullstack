import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Usuario from '../Models/A-usuario.model.js';

const uri = process.env.KEFEX;
const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!uri || !name || !email || !password || password.length < 12) {
  console.error('Set KEFEX, ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in the environment.');
  process.exit(1);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const existing = await Usuario.findOne({ rol: 'admin' }).select('_id email');
  if (existing) {
    console.error(`Admin bootstrap blocked: an administrator already exists (${existing.email}). Use an authenticated admin account to manage roles.`);
    process.exitCode = 1;
  } else if (await Usuario.exists({ email })) {
    console.error('Admin bootstrap blocked: that email already belongs to an account. Use a different email or promote the account through an authorized administrative workflow.');
    process.exitCode = 1;
  } else {
    const user = await Usuario.create({ name, email, password: await bcrypt.hash(password, 12), rol: 'admin' });
    console.log(`Initial administrator created: ${user.email} (${user._id}). Remove ADMIN_PASSWORD from the environment after use.`);
  }
} catch (error) {
  console.error('Could not create initial administrator:', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
