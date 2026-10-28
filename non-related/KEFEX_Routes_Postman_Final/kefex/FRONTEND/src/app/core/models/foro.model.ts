/** API contract aligned with Back/src/Models/E-opinionForumModule.js. */
export interface ForumOpinion {
  _id: string;
  title: string;
  opinion: string;
  excerpt?: string;
  category: 'ecommerce' | 'technology' | 'fashion' | 'home' | 'gaming' | 'beauty' | 'supermarket' | 'marketplace';
  categoryLabel?: string;
  score: number;
  votes: number;
  commentsCount: number;
  author: { name: string; avatar: string; userId?: string };
  product?: { name: string; brand: string; price: string; image?: string; officialUrl: string };
  isUserPost: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Presentation model consumed by the Angular forum components. */
export interface ForoPost {
  id: string | number;
  titulo: string;
  contenido: string;
  categoria: string;
  autorNombre: string;
  autorAvatar: string;
  votosCount: number;
  score?: number;
  comentariosCount: number;
  comentarios?: Comentario[];
  fechaCreacion: string;
}

/** API contract aligned with the forum comment schema. */
export interface ComentarioForo {
  _id: string;
  opinion: string;
  autor: { nombre: string; avatar: string; usuarioId: string };
  texto: string;
  likes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comentario {
  id: string | number;
  autorNombre: string;
  autorAvatar: string;
  contenido: string;
  fecha: string;
}
