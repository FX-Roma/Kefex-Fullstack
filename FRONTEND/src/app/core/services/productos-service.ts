import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../enviroments/enviroment';
import { Producto } from '../models/producto.model';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/productos`;

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crear(datos: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, datos);
  }

  actualizar(id: string, datos: FormData): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.apiUrl}/${id}`,
      datos
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
