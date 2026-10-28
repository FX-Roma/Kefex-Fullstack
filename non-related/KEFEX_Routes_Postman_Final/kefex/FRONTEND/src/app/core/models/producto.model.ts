/** API contract aligned with Back/src/Models/E-productStoreModule.js. */
export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  stock: number;
  valoracion: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal?: number;
}
