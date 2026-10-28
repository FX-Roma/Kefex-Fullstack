/** API contract aligned with Back/src/Models/A-publicacion.model.js. */
export interface Publicacion {
  _id: string;
  autor: string | { _id: string; name: string; email?: string; avatar?: string };
  contenido: string;
  multimedia: string | null;
  categoria: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Frontend projection used by feed and discovery cards; never persisted directly as a Mongoose document. */
export interface PublicacionViewModel {
  id: string | number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  videoUrl?: string;
  categoria: string;
  autor: { id: string | number; nombre: string; avatarUrl: string; username: string };
  likesCount: number;
  esFavorito?: boolean;
  favoriteId?: string;
  fechaCreacion: string;
}
