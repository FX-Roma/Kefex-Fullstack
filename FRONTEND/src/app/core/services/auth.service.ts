import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Usuario } from '../models/usuario.model';

interface AuthResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = 'http://localhost:3000/api/auth';

  currentUser = signal<Usuario | null>(null);
  tokenKey = 'kefex_auth_token';

  constructor() {
    // Solo intenta cargar la sesión si estamos ejecutando en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSesionGuardada();
    }
  }

  login(credenciales: { email: string; password: string }): Observable<{ token: string; usuario: Usuario }> {
    return this.http.post<{ token: string; usuario: Usuario }>(`${this.API_URL}/login`, credenciales).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, res.token);
        }
        this.currentUser.set(res.usuario);
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUser.set(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  private cargarSesionGuardada(): void {
    const token = this.getToken();
    if (token) {
      this.http.get<Usuario>(`${this.API_URL}/me`).subscribe({
        next: (user) => this.currentUser.set(user),
        error: () => this.logout()
      });
    }
  }
}