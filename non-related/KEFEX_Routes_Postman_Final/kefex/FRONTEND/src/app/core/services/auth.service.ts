import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../enviroments/enviroment';
import { Credential, AuthResponse, DecodedToken } from '../models/credential';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  readonly currentUser = signal<DecodedToken | null>(this.getInitialTokenState());

  login(credential: Credential): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/user/login`, credential);
  }

  loginAdmin(credential: Credential): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/admin/login`, credential);
  }

  register(payload: { name: string; email: string; password: string }): Observable<{ result: string; message: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/user/register`, payload);
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('token', token);
    this.currentUser.set(this.decodeToken(token));
  }

  getToken(): string | null {
    return typeof window === 'undefined' ? null : window.localStorage.getItem('token');
  }

  logout(): void {
    if (typeof window !== 'undefined') window.localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        ...decoded,
        nombre: decoded.nombre || decoded.name || 'Usuario',
        username: decoded.username || decoded.email || '',
        avatarUrl: decoded.avatarUrl || decoded.avatar || '',
        biografia: decoded.biografia || '',
        rol: decoded.rol === 'admin' ? 'admin' : 'user'
      };
    } catch { return null; }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    return Boolean(decoded?.exp && decoded.exp * 1000 > Date.now());
  }

  getUserRole(): 'user' | 'admin' | null {
    if (!this.isAuthenticated()) return null;
    return this.currentUser()?.rol ?? null;
  }

  private getInitialTokenState(): DecodedToken | null {
    const token = this.getToken();
    const decoded = token ? this.decodeToken(token) : null;
    return decoded?.exp && decoded.exp * 1000 > Date.now() ? decoded : null;
  }
}
