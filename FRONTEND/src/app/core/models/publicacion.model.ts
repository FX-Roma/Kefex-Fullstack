export interface Publicacion {
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
  fechaCreacion: string;
}