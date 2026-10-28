import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Usuario from '../src/Models/User.model.js';

const email = process.env.RESET_ADMIN_EMAIL?.trim().toLowerCase();
const newPassword = process.env.RESET_ADMIN_PASSWORD;

try {
  if (!process.env.KEFEX) {
    throw new Error('Missing KEFEX MongoDB connection URI.');
  }

  if (!email || !newPassword || newPassword.length < 12) {
    throw new Error(
      'Provide RESET_ADMIN_EMAIL and a password of at least 12 characters.'
    );
  }

  await mongoose.connect(process.env.KEFEX);

  const admin = await Usuario.findOne({
    email,
    rol: 'admin'
  }).select('_id name email rol');

  if (!admin) {
    throw new Error(
      'No administrator with that email exists in this database.'
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await Usuario.updateOne(
    { _id: admin._id, rol: 'admin' },
    { $set: { password: passwordHash } }
  );

  console.log('Administrator password reset successfully.');
  console.log(`Account: ${admin.email}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}