import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Publicacion } from '../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private http = inject(HttpClient);
  // Usar 127.0.0.1 previene fallos de IPv6 durante SSR
  private readonly API_URL = 'http://127.0.0.1:3000/api/publicaciones';

  // Datos mock de fallback si la API está desconectada
  private mockPublicaciones: Publicacion[] = [
    {
      id: 1,
      titulo: 'Rediseño UI/UX Sistema KEFEX',
      descripcion: 'Exploración de interfaz moderna con Angular 19 y arquitectura reactiva.',
      imagenUrl: 'assets/F-Kefex.png',
      categoria: 'Diseño',
      autor: {
        id: 1,
        nombre: 'Andrés Galvis',
        username: 'andres_kefex',
        avatarUrl: 'assets/Kefex-ph.png'
      },
      likesCount: 24,
      esFavorito: false,
      fechaCreacion: new Date().toISOString()
    }
  ];

  obtenerPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.API_URL).pipe(
      catchError(err => {
        console.warn('Backend Express no detectable en el puerto 3000. Cargando datos localmente.', err.message);
        return of(this.mockPublicaciones);
      })
    );
  }

  obtenerPorCategoria(categoria: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.API_URL}?categoria=${categoria}`).pipe(
      catchError(() => of(this.mockPublicaciones.filter(p => p.categoria === categoria)))
    );
  }

  buscar(query: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.API_URL}/buscar?q=${query}`).pipe(
      catchError(() => of(this.mockPublicaciones.filter(p => p.titulo.toLowerCase().includes(query.toLowerCase()))))
    );
  }
}