import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { PublicacionViewModel } from '../models/publicacion.model';
interface ApiFavorite { _id: string; publicacion?: { _id: string; contenido: string; multimedia?: string | null; categoria: string; autor?: { name?: string; avatar?: string }; createdAt?: string }; }
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly http = inject(HttpClient); private readonly platformId = inject(PLATFORM_ID); private readonly apiUrl = `${environment.apiUrl}/favoritos`;
  readonly favoritos = signal<PublicacionViewModel[]>([]);
  cargarFavoritos(): void {
    this.http.get<{ favoritos?: ApiFavorite[] } | PublicacionViewModel[]>(this.apiUrl).subscribe({ next: response => {
      if (Array.isArray(response)) { this.favoritos.set(response); return; }
      this.favoritos.set((response.favoritos ?? []).filter(item => item.publicacion).map(item => ({ id: item.publicacion!._id, favoriteId: item._id, titulo: item.publicacion!.contenido.slice(0, 100), descripcion: item.publicacion!.contenido, imagenUrl: item.publicacion!.multimedia ?? '', categoria: item.publicacion!.categoria, autor: { id: 0, nombre: item.publicacion!.autor?.name || 'Comunidad KEFEX', username: '', avatarUrl: item.publicacion!.autor?.avatar || '' }, likesCount: 0, esFavorito: true, fechaCreacion: item.publicacion!.createdAt || '' })));
    }, error: () => { if (!isPlatformBrowser(this.platformId)) return; try { const stored = localStorage.getItem('kefex_favoritos'); this.favoritos.set(stored ? JSON.parse(stored) as PublicacionViewModel[] : []); } catch { this.favoritos.set([]); } }});
  }
  toggleFavorito(publicacion: PublicacionViewModel): Observable<unknown> {
    const existing = this.favoritos().some(item => String(item.id) === String(publicacion.id));
    if (existing) { if (!publicacion.favoriteId) return throwError(() => new Error('No se encontró el identificador del favorito. Recarga la lista e inténtalo de nuevo.')); return this.http.delete(`${this.apiUrl}/${publicacion.favoriteId}`).pipe(tap(() => { this.favoritos.update(items => items.filter(item => String(item.id) !== String(publicacion.id))); if (isPlatformBrowser(this.platformId)) localStorage.setItem('kefex_favoritos', JSON.stringify(this.favoritos())); })); }
    return this.http.post(this.apiUrl, { publicacionId: publicacion.id }).pipe(tap(() => { this.favoritos.update(items => [...items, { ...publicacion, esFavorito: true }]); if (isPlatformBrowser(this.platformId)) localStorage.setItem('kefex_favoritos', JSON.stringify(this.favoritos())); }));
  }
}
