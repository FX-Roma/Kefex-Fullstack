import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForoService } from '../../core/services/foro.service';
import { ForoPost } from '../../core/models/foro.model';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foro.html',
  styleUrl: './foro.css'
})
export class ForoComponent implements OnInit {
  private foroService = inject(ForoService);

  hilos = signal<ForoPost[]>([]);
  categoriaFiltro = signal<string>('todos');
  nuevoTitulo = '';
  nuevoContenido = '';
  nuevaCategoria = 'General';
  modalCrearAbierto = false;

  ngOnInit(): void {
    this.cargarHilos();
  }

  cargarHilos(): void {
    this.foroService.obtenerHilos().subscribe({
      next: (posts) => this.hilos.set(posts),
      error: (err) => console.error('Error cargando foro:', err)
    });
  }

  votar(hiloId: string | number, tipo: 'up' | 'down'): void {
    this.foroService.votarHilo(hiloId, tipo).subscribe({
      next: (res) => {
        this.hilos.update(posts => posts.map(p => p.id === hiloId ? { ...p, votosCount: res.votosCount } : p));
      }
    });
  }

  crearNuevoHilo(): void {
    if (!this.nuevoTitulo.trim() || !this.nuevoContenido.trim()) return;

    this.foroService.crearHilo({
      titulo: this.nuevoTitulo,
      contenido: this.nuevoContenido,
      categoria: this.nuevaCategoria
    }).subscribe({
      next: (nuevo) => {
        this.hilos.update(posts => [nuevo, ...posts]);
        this.cerrarModal();
      }
    });
  }

  abrirModal(): void { this.modalCrearAbierto = true; }
  cerrarModal(): void {
    this.modalCrearAbierto = false;
    this.nuevoTitulo = '';
    this.nuevoContenido = '';
  }
}