/** Persisted publication shape returned by the KEFEX API. */
export interface Publicacion {
  _id: string;
  autor: string | { _id: string; name: string; email?: string; avatar?: string };
  contenido: string;
  multimedia: string | null;
  categoria: string;
  createdAt?: string;
  updatedAt?: string;
}

/** UI projection for publication cards. Keep required display fields normalized. */
export interface PublicacionViewModel {
  id: string | number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  videoUrl?: string;
  categoria: string;
  autor: {
    id: string | number;
    nombre: string;
    avatarUrl: string;
    username: string;
  };
  likesCount: number;
  esFavorito?: boolean;
  favoriteId?: string;
  fechaCreacion: string;
}
