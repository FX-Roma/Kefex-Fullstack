import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';
import { PublicacionViewModel } from '../models/publicacion.model';
interface ApiPublication { _id?: string; id?: string | number; contenido?: string; titulo?: string; descripcion?: string; categoria?: string; multimedia?: string; imagenUrl?: string; autor?: { _id?: string; id?: string | number; name?: string; nombre?: string; email?: string; username?: string; avatar?: string; avatarUrl?: string }; likesCount?: number; createdAt?: string; fechaCreacion?: string; }
@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient); private readonly apiUrl = `${environment.apiUrl}/publicaciones`; readonly publicaciones = signal<PublicacionViewModel[]>([]); readonly isDemoMode = signal(false);
  private readonly mockPublicaciones: PublicacionViewModel[] = [{ id: 1, titulo: 'Rediseño de experiencia KEFEX', descripcion: 'Diseño de producto, comunidad y reseñas con una interfaz cyber-SaaS.', imagenUrl: 'assets/F-Kefex.png', categoria: 'Diseño', autor: { id: 1, nombre: 'Equipo KEFEX', username: 'kefex', avatarUrl: 'assets/Kefex-ph.png' }, likesCount: 24, esFavorito: false, fechaCreacion: new Date().toISOString() }];
  obtenerPublicaciones(filters: { q?: string; categoria?: string; page?: number; limit?: number } = {}): Observable<PublicacionViewModel[]> {
    let params = new HttpParams(); for (const [key, value] of Object.entries(filters)) if (value !== undefined && value !== '') params = params.set(key, String(value));
    return this.http.get<{ publicaciones?: ApiPublication[] } | ApiPublication[]>(this.apiUrl, { params }).pipe(
      map(response => Array.isArray(response) ? response : response.publicaciones ?? []),
      map(items => items.map(item => ({ id: item._id || item.id || '', titulo: item.titulo || item.contenido?.slice(0, 110) || 'Publicación KEFEX', descripcion: item.descripcion || item.contenido || '', imagenUrl: item.imagenUrl || item.multimedia || '', categoria: item.categoria || 'General', autor: { id: item.autor?._id || item.autor?.id || '', nombre: item.autor?.name || item.autor?.nombre || 'Comunidad KEFEX', username: item.autor?.username || item.autor?.email || '', avatarUrl: item.autor?.avatarUrl || item.autor?.avatar || '' }, likesCount: item.likesCount || 0, esFavorito: false, fechaCreacion: item.fechaCreacion || item.createdAt || '' } as PublicacionViewModel))),
      map(items => { this.isDemoMode.set(false); this.publicaciones.set(items); return items; }), catchError(() => { this.isDemoMode.set(true); this.publicaciones.set(this.mockPublicaciones); return of(this.mockPublicaciones); })
    );
  }
  obtenerPorCategoria(categoria: string): Observable<PublicacionViewModel[]> { return this.obtenerPublicaciones({ categoria }); }
  buscar(query: string): Observable<PublicacionViewModel[]> { return this.obtenerPublicaciones({ q: query }); }
  crearPublicacion(payload: FormData): Observable<unknown> { return this.http.post(this.apiUrl, payload); }
}
