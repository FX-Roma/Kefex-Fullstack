import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../core/services/favoritos.service';
import { PublicacionViewModel } from '../../core/models/publicacion.model';
@Component({ selector: 'app-favoritos', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './favoritos.html', styleUrls: ['./favoritos.css'] })
export class FavoritosComponent {
  readonly favoritesService = inject(FavoritosService); readonly message = signal('');
  constructor() { this.favoritesService.cargarFavoritos(); }
  title(post: PublicacionViewModel): string { return post.titulo || 'Publicación KEFEX'; }
  remove(post: PublicacionViewModel): void { this.favoritesService.toggleFavorito(post).subscribe({ error: () => this.message.set('No fue posible actualizar los favoritos en el servidor.') }); }
}
