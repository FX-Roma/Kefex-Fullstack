import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Usuario } from '../models/usuario.model';

interface AuthResponse { token: string; usuario: Usuario; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = 'http://localhost:3005/api/auth';
  currentUser = signal<Usuario | null>(null);
  tokenKey = 'kefex_auth_token';

  constructor() { if (isPlatformBrowser(this.platformId)) this.cargarSesionGuardada(); }

  login(credenciales: { identificador: string; contrasena: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credenciales).pipe(tap(res => this.guardarSesion(res)), catchError(err => throwError(() => err)));
  }

  register(datos: { nombre: string; username: string; correo: string; contrasena: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, datos).pipe(tap(res => this.guardarSesion(res)), catchError(err => throwError(() => err)));
  }

  logout(): void { if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.tokenKey); this.currentUser.set(null); }
  getToken(): string | null { return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.tokenKey) : null; }
  estaAutenticado(): boolean { return !!this.getToken(); }

  private guardarSesion(res: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(this.tokenKey, res.token);
    this.currentUser.set(res.usuario);
  }

  private cargarSesionGuardada(): void {
    const token = this.getToken(); if (!token) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any>(`${this.API_URL}/me`, { headers }).subscribe({
      next: res => this.currentUser.set(res.usuario ?? res),
      error: () => this.logout()
    });
  }
}
