import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Publicacion } from '../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = 'http://localhost:3000/api/favoritos';
  
  favoritos = signal<Publicacion[]>([]);

  cargarFavoritos(): void {
    this.http.get<Publicacion[]>(this.API_URL).subscribe({
      next: (items) => this.favoritos.set(items),
      error: () => {
        if (isPlatformBrowser(this.platformId)) {
          const local = localStorage.getItem('kefex_favoritos');
          if (local) this.favoritos.set(JSON.parse(local));
        }
      }
    });
  }

  toggleFavorito(publicacion: Publicacion): Observable<any> {
    const estaEnFavs = this.favoritos().some(item => item.id === publicacion.id);
    const endpoint = estaEnFavs ? `${this.API_URL}/remover` : `${this.API_URL}/agregar`;

    return this.http.post(endpoint, { id: publicacion.id }).pipe(
      tap(() => {
        if (estaEnFavs) {
          this.favoritos.update(favs => favs.filter(f => f.id !== publicacion.id));
        } else {
          this.favoritos.update(favs => [...favs, { ...publicacion, esFavorito: true }]);
        }

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('kefex_favoritos', JSON.stringify(this.favoritos()));
        }
      })
    );
  }
}