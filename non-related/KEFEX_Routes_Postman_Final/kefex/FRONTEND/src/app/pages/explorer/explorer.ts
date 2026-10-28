import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { PublicacionViewModel } from '../../core/models/publicacion.model';
@Component({ selector: 'app-explorer', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './explorer.html', styleUrls: ['./explorer.css'] })
export class ExplorerComponent {
  readonly service = inject(PublicacionesService); readonly query = signal(''); readonly category = signal('Todas'); readonly sort = signal<'recent'|'popular'>('recent'); readonly posts = signal<PublicacionViewModel[]>([]); readonly loading = signal(true); readonly categories = ['Todas', 'Tecnología', 'Diseño', 'Gaming', 'E-commerce', 'General'];
  constructor() { this.search(); }
  search(): void { this.loading.set(true); this.service.obtenerPublicaciones({ q: this.query().trim() || undefined, categoria: this.category() === 'Todas' ? undefined : this.category() }).subscribe(posts => { this.posts.set([...posts].sort((a,b) => this.sort() === 'popular' ? (b.likesCount ?? 0) - (a.likesCount ?? 0) : new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())); this.loading.set(false); }); }
  setCategory(category: string): void { this.category.set(category); this.search(); }
  setSort(sort: 'recent'|'popular'): void { this.sort.set(sort); this.search(); }
  title(post: PublicacionViewModel): string { return post.titulo || 'Publicación KEFEX'; }
}
