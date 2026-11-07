import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { PublicationCardComponent } from '../../componentes/publication-card/publication-card';
import { PublicacionViewModel } from '../../core/models/publicacion.model';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, PublicationCardComponent],
  templateUrl: './explorer.html',
  styleUrl: './explorer.css'
})
export class ExplorerComponent {
  private readonly service = inject(PublicacionesService);
  readonly query = signal('');
  readonly category = signal('Todas');
  readonly sort = signal<'recent' | 'popular'>('recent');
  readonly posts = signal<PublicacionViewModel[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly categories = ['Todas', 'E-commerce', 'Tecnología', 'Gaming', 'Diseño', 'Hogar', 'Moda', 'General'];
  readonly sortedPosts = computed(() => [...this.posts()].sort((a, b) => this.sort() === 'popular'
    ? b.likesCount - a.likesCount
    : new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()));

  constructor() { this.search(); }

  search(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.obtenerPublicaciones({
      q: this.query().trim() || undefined,
      categoria: this.category() === 'Todas' ? undefined : this.category(),
      limit: 30
    }).subscribe({
      next: posts => { this.posts.set(posts); this.loading.set(false); },
      error: () => { this.error.set('No fue posible cargar las publicaciones.'); this.loading.set(false); }
    });
  }

  setCategory(category: string): void { this.category.set(category); this.search(); }
  setSort(value: 'recent' | 'popular'): void { this.sort.set(value); }
}
