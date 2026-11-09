
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Producto } from '../../core/models/producto.model';
import { ProductosService } from '../../core/services/productos-service';

@Component({
  selector: 'app-crud-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-productos.html',
  styleUrl: './crud-productos.css'
})
export class CrudProductosComponent implements OnInit {

  private productosService = inject(ProductosService);

  productos = signal<Producto[]>([]);
  mostrarFormulario = signal(false);
  modo = signal<'crear' | 'editar'>('crear');
  cargando = signal(false);
  error = signal('');

  productoForm: Partial<Producto> = this.productoVacio();
  archivoSeleccionado: File | null = null;

  ngOnInit(): void {
    this.obtenerProductos();
  }

  productoVacio(): Partial<Producto> {
    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      imagen: '',
      stock: 0,
      valoracion: 0
    };
  }

  obtenerProductos(): void {
    this.cargando.set(true);

    this.productosService.obtenerTodos().subscribe({
      next: (datos) => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.cargando.set(false);
      }
    });
  }

  prepararCrear(): void {
    this.modo.set('crear');
    this.productoForm = this.productoVacio();
    this.archivoSeleccionado = null;
    this.error.set('');
    this.mostrarFormulario.set(true);
  }

  prepararEditar(producto: Producto): void {
    this.modo.set('editar');
    this.productoForm = { ...producto };
    this.archivoSeleccionado = null;
    this.error.set('');
    this.mostrarFormulario.set(true);
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivoSeleccionado = input.files?.[0] ?? null;
  }

  guardarProducto(): void {
    if (!this.productoForm.nombre ||
        !this.productoForm.descripcion ||
        !this.productoForm.categoria) {
      this.error.set('Completa todos los campos obligatorios.');
      return;
    }

    if (this.modo() === 'crear' && !this.archivoSeleccionado) {
      this.error.set('Selecciona una imagen.');
      return;
    }

    const datos = new FormData();

    datos.append('nombre', String(this.productoForm.nombre));
    datos.append('descripcion', String(this.productoForm.descripcion));
    datos.append('precio', String(this.productoForm.precio ?? 0));
    datos.append('categoria', String(this.productoForm.categoria));
    datos.append('stock', String(this.productoForm.stock ?? 0));
    datos.append('valoracion', String(this.productoForm.valoracion ?? 0));

    if (this.archivoSeleccionado) {
      datos.append('imagen', this.archivoSeleccionado);
    }

    this.cargando.set(true);

    const peticion = this.modo() === 'crear'
      ? this.productosService.crear(datos)
      : this.productosService.actualizar(
          String(this.productoForm._id),
          datos
        );

    peticion.subscribe({
      next: () => {
        this.cancelarFormulario();
        this.obtenerProductos();
      },
      error: (err) => {
        this.error.set(
          err.error?.mensaje || 'No se pudo guardar el producto.'
        );
        this.cargando.set(false);
      }
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.productoForm = this.productoVacio();
    this.archivoSeleccionado = null;
  }

  eliminarProducto(producto: Producto): void {
    if (!confirm(`¿Eliminar ${producto.nombre}?`)) {
      return;
    }

    this.productosService.eliminar(producto._id).subscribe({
      next: () => {
        this.obtenerProductos();
      },
      error: () => {
        this.error.set('No se pudo eliminar el producto.');
      }
    });
  }
}
