export interface Comentario {
  id: string | number;
  autorNombre: string;
  autorAvatar: string;
  contenido: string;
  fecha: string;
}

export interface ForoPost {
  id: string | number;
  titulo: string;
  contenido: string;
  categoria: string;
  autorNombre: string;
  autorAvatar: string;
  votosCount: number;
  comentariosCount: number;
  comentarios?: Comentario[];
  fechaCreacion: string;
}