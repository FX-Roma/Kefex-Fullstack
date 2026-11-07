import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { PublicacionViewModel } from '../models/publicacion.model';

interface ApiFavoritePublication {
  _id?: string;
  id?: string;
  contenido?: string;
  titulo?: string;
  descripcion?: string;
  multimedia?: string | null;
  imagenUrl?: string | null;
  categoria?: string;
  createdAt?: string;
  likesCount?: number;
  autor?: {
    _id?: string;
    name?: string;
    nombre?: string;
    email?: string;
    username?: string;
    avatar?: string;
    avatarUrl?: string;
  };
}

interface ApiFavorite {
  _id: string;
  publicacion?: ApiFavoritePublication | null;
}

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = `${environment.apiUrl}/favoritos`;

  readonly favoritos = signal<PublicacionViewModel[]>([]);

  cargarFavoritos(): void {
    this.http.get<{ favoritos?: ApiFavorite[] } | ApiFavorite[]>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : response.favoritos ?? []),
      map(items => items
        .filter((item): item is ApiFavorite & { publicacion: ApiFavoritePublication } => !!item.publicacion)
        .map(item => this.toViewModel(item)))
    ).subscribe({
      next: items => {
        this.favoritos.set(items);
        this.persist(items);
      },
      error: () => this.restoreLocalFavorites()
    });
  }

  toggleFavorito(publicacion: PublicacionViewModel): Observable<unknown> {
    const existing = this.favoritos().find(item => String(item.id) === String(publicacion.id));

    if (existing) {
      if (!existing.favoriteId) {
        return throwError(() => new Error('No se encontró el identificador del favorito. Recarga la lista e inténtalo de nuevo.'));
      }

      return this.http.delete(`${this.apiUrl}/${encodeURIComponent(existing.favoriteId)}`).pipe(
        tap(() => {
          const updated = this.favoritos().filter(item => String(item.id) !== String(publicacion.id));
          this.favoritos.set(updated);
          this.persist(updated);
        })
      );
    }

    return this.http.post(this.apiUrl, { publicacionId: publicacion.id }).pipe(
      tap(response => {
        const favoriteId = this.readFavoriteId(response);
        const updated = [...this.favoritos(), { ...publicacion, favoriteId, esFavorito: true }];
        this.favoritos.set(updated);
        this.persist(updated);
      })
    );
  }

  private toViewModel(item: ApiFavorite & { publicacion: ApiFavoritePublication }): PublicacionViewModel {
    const publication = item.publicacion;
    const author = publication.autor;
    const content = publication.contenido ?? publication.descripcion ?? '';

    return {
      id: publication._id ?? publication.id ?? '',
      favoriteId: item._id,
      titulo: publication.titulo?.trim() || this.createTitle(content),
      descripcion: publication.descripcion ?? content,
      imagenUrl: publication.imagenUrl ?? publication.multimedia ?? '',
      categoria: publication.categoria?.trim() || 'General',
      autor: {
        id: author?._id ?? '',
        nombre: author?.name ?? author?.nombre ?? 'Comunidad KEFEX',
        username: author?.username ?? author?.email ?? '',
        avatarUrl: author?.avatarUrl ?? author?.avatar ?? ''
      },
      likesCount: publication.likesCount ?? 0,
      esFavorito: true,
      fechaCreacion: publication.createdAt ?? ''
    };
  }

  private readFavoriteId(response: unknown): string | undefined {
    if (!response || typeof response !== 'object') return undefined;
    const value = response as { favorito?: { _id?: string }; favorite?: { _id?: string }; _id?: string };
    return value.favorito?._id ?? value.favorite?._id ?? value._id;
  }

  private createTitle(content: string): string {
    const normalized = content.trim();
    if (!normalized) return 'Publicación KEFEX';
    return normalized.length > 90 ? `${normalized.slice(0, 87).trimEnd()}…` : normalized;
  }

  private persist(items: PublicacionViewModel[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('kefex_favoritos', JSON.stringify(items));
    }
  }

  private restoreLocalFavorites(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const stored = localStorage.getItem('kefex_favoritos');
      this.favoritos.set(stored ? JSON.parse(stored) as PublicacionViewModel[] : []);
    } catch {
      this.favoritos.set([]);
    }
  }
}
