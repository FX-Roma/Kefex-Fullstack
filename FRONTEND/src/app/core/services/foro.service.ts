import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForoPost, Comentario } from '../models/foro.model';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/foro';

  obtenerHilos(): Observable<ForoPost[]> {
    return this.http.get<ForoPost[]>(this.API_URL);
  }

  crearHilo(post: Partial<ForoPost>): Observable<ForoPost> {
    return this.http.post<ForoPost>(this.API_URL, post);
  }

  agregarComentario(hiloId: string | number, comentario: string): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.API_URL}/${hiloId}/comentarios`, { contenido: comentario });
  }

  votarHilo(hiloId: string | number, tipo: 'up' | 'down'): Observable<{ votosCount: number }> {
    return this.http.post<{ votosCount: number }>(`${this.API_URL}/${hiloId}/votar`, { tipo });
  }
}