import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { AuthService } from '../../core/services/auth.service';
import { PublicationCardComponent } from '../../componentes/publication-card/publication-card';
import { PublicationComposerComponent } from '../../componentes/publication-composer/publication-composer';
import { PublicacionViewModel } from '../../core/models/publicacion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicationCardComponent, PublicationComposerComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  readonly publicacionesService = inject(PublicacionesService);
  private readonly favoritosService = inject(FavoritosService);
  private readonly authService = inject(AuthService);
  readonly selectedTab = signal<'explore' | 'following' | 'trending'>('explore');
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly posts = this.publicacionesService.publicaciones;
  readonly visiblePublications = computed(() => {
    const items = this.posts();
    if (this.selectedTab() === 'trending') return [...items].sort((a, b) => b.likesCount - a.likesCount);
    // Following feed is intentionally empty until a real follow graph exists.
    if (this.selectedTab() === 'following') return [];
    return items;
  });
  readonly trendingTopics = ['#CompraSegura', '#ReseñasReales', '#Marketplace', '#Tecnología', '#ExperienciaDeCompra'];

  constructor() {
    if (this.authService.isAuthenticated()) this.favoritosService.cargarFavoritos();
    this.loadFeed();
  }

  loadFeed(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.publicacionesService.obtenerPublicaciones({ limit: 30 }).subscribe({
      next: () => this.loading.set(false),
      error: () => { this.loading.set(false); this.errorMessage.set('No se pudo conectar con el servicio de publicaciones.'); }
    });
  }

  setTab(tab: 'explore' | 'following' | 'trending'): void { this.selectedTab.set(tab); }
}
