export interface Producto {
  id: string | number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  stock: number;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}