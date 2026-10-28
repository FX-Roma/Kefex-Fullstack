/** Safe API projection of the Mongoose Usuario model. Password hashes are never exposed to clients. */
export type UserRole = 'user' | 'admin';
export type UserStatus = 'activo' | 'inactivo';

export interface Usuario {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  rol: UserRole;
  avatar: string;
  biografia: string;
  estado: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}
