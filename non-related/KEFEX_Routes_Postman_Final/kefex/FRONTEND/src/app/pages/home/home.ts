import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { AuthService } from '../../core/services/auth.service';

interface Publication {
  id: string | number;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  badgeRole: string;
  timeAgo: string;
  title: string;
  content: string;
  codeSnippet?: string;
  category: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  views: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  readonly publicacionesService = inject(PublicacionesService);
  private readonly favoritosService = inject(FavoritosService);
  private readonly authService = inject(AuthService);
  readonly feedbackMessage = signal('');
  selectedTab = signal<'explore' | 'following' | 'trending'>('explore');
  publications = signal<Publication[]>([]);

  visiblePublications = computed(() => {
    const posts = this.publications();
    if (this.selectedTab() === 'following') return [];
    if (this.selectedTab() === 'trending') return [...posts].sort((a, b) => b.likes - a.likes);
    return posts;
  });

  constructor() {
    if (this.authService.isAuthenticated()) this.favoritosService.cargarFavoritos();
    this.publicacionesService.obtenerPublicaciones({ limit: 20 }).subscribe((items) => {
      this.publications.set(items.map((item) => ({
        id: item.id,
        authorName: item.autor.nombre,
        authorHandle: item.autor.username ? `@${item.autor.username}` : '@comunidad_kefex',
        authorAvatar: item.autor.avatarUrl || 'assets/Kefex-ph.png',
        badgeRole: 'Miembro KEFEX',
        timeAgo: item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleDateString('es-CO') : 'Reciente',
        title: item.titulo,
        content: item.descripcion,
        category: item.categoria,
        tags: [item.categoria.replace(/\s+/g, ''), 'KEFEX'],
        likes: item.likesCount || 0,
        commentsCount: 0,
        views: '—',
      })));
    });
  }


  trendingTopics = ['#CompraSegura', '#ReseñasReales', '#Marketplace', '#Tecnología', '#ExperienciaDeCompra'];

  setTab(tab: 'explore' | 'following' | 'trending'): void {
    this.selectedTab.set(tab);
  }

  toggleBookmark(post: Publication): void {
    if (!this.authService.isAuthenticated()) { this.feedbackMessage.set('Inicia sesión para guardar favoritos.'); return; }
    const publication = this.publicacionesService.publicaciones().find(item => String(item.id) === String(post.id));
    if (!publication) { this.feedbackMessage.set('Esta tarjeta de demostración no se puede guardar.'); return; }
    const wasSaved = this.favoritosService.favoritos().some(item => String(item.id) === String(post.id));
    this.favoritosService.toggleFavorito(publication).subscribe({ next: () => { post.isBookmarked = !wasSaved; this.feedbackMessage.set(wasSaved ? 'Publicación retirada de favoritos.' : 'Publicación guardada en favoritos.'); }, error: () => this.feedbackMessage.set('No fue posible actualizar favoritos en el servidor.') });
  }

}