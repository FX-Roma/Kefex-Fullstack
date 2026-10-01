export interface Usuario {
  id: string | number;
  nombre: string;
  username: string;
  email?: string; // Se agrega el signo '?' para hacerlo opcional
  avatarUrl?: string;
  profesion?: string;
  biografia?: string;
  seguidoresCount?: number;
  siguiendoCount?: number;
  esDisenador?: boolean;
}