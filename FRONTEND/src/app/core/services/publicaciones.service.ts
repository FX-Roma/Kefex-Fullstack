import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { PublicacionViewModel } from '../models/publicacion.model';

interface ApiAuthor {
  _id?: string;
  id?: string | number;
  name?: string;
  nombre?: string;
  email?: string;
  username?: string;
  avatar?: string;
  avatarUrl?: string;
}

interface ApiPublication {
  _id?: string;
  id?: string | number;
  contenido?: string;
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  multimedia?: string | null;
  imagenUrl?: string | null;
  autor?: ApiAuthor | string;
  likesCount?: number;
  createdAt?: string;
  fechaCreacion?: string;
  esFavorito?: boolean;
}

interface PublicationsResponse {
  publicaciones?: ApiPublication[];
  data?: ApiPublication[];
}

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/publicaciones`;

  readonly publicaciones = signal<PublicacionViewModel[]>([]);

  obtenerPublicaciones(filters: {
    q?: string;
    categoria?: string;
    page?: number;
    limit?: number;
  } = {}): Observable<PublicacionViewModel[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return this.http.get<PublicationsResponse | ApiPublication[]>(this.apiUrl, { params }).pipe(
      map(response => {
        if (Array.isArray(response)) return response;
        return response.publicaciones ?? response.data ?? [];
      }),
      map(items => items.map(item => this.toViewModel(item))),
      tap(items => this.publicaciones.set(items))
    );
  }

  /** Compatibility alias for components that use the conventional CRUD name. */
  getAll(): Observable<PublicacionViewModel[]> {
    return this.obtenerPublicaciones();
  }

  obtenerPorCategoria(categoria: string): Observable<PublicacionViewModel[]> {
    return this.obtenerPublicaciones({ categoria });
  }

  buscar(query: string): Observable<PublicacionViewModel[]> {
    return this.obtenerPublicaciones({ q: query });
  }

  crearPublicacion(payload: FormData): Observable<unknown> {
    return this.http.post<{ publicacion?: ApiPublication }>(this.apiUrl, payload).pipe(
      tap(response => {
        if (response.publicacion) {
          const created = this.toViewModel(response.publicacion);
          this.publicaciones.update(current => [created, ...current]);
        }
      })
    );
  }

  private toViewModel(item: ApiPublication): PublicacionViewModel {
    const author = typeof item.autor === 'object' && item.autor !== null ? item.autor : undefined;
    const content = item.contenido ?? item.descripcion ?? '';

    return {
      id: item._id ?? item.id ?? '',
      titulo: item.titulo?.trim() || this.createTitle(content),
      descripcion: item.descripcion ?? content,
      imagenUrl: this.resolveMediaUrl(item.imagenUrl ?? item.multimedia ?? ''),
      categoria: item.categoria?.trim() || 'General',
      autor: {
        id: author?._id ?? author?.id ?? (typeof item.autor === 'string' ? item.autor : ''),
        nombre: author?.name ?? author?.nombre ?? 'Comunidad KEFEX',
        username: author?.username ?? author?.email ?? '',
        avatarUrl: author?.avatarUrl ?? author?.avatar ?? ''
      },
      likesCount: item.likesCount ?? 0,
      esFavorito: item.esFavorito ?? false,
      fechaCreacion: item.fechaCreacion ?? item.createdAt ?? ''
    };
  }

  private resolveMediaUrl(value: string): string {
    if (!value) return '';

    // Preserve absolute URLs.
    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    // Remove the /api suffix from the backend URL.
    const apiOrigin = environment.apiUrl.replace(/\/api\/?$/, '');

    // Normalize the media path.
    const mediaPath = value.startsWith('/') ? value : `/${value}`;

    return `${apiOrigin}${mediaPath}`;
  }

  private createTitle(content: string): string {
    const normalized = content.trim();
    if (!normalized) return 'Publicación KEFEX';
    return normalized.length > 90 ? `${normalized.slice(0, 87).trimEnd()}…` : normalized;
  }
}
