import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
interface ProfileApiUser { id: string; name: string; email: string; rol: 'user' | 'admin'; avatar?: string; biografia?: string; createdAt?: string; }
@Component({ selector: 'app-profile', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './profile.html', styleUrls: ['./profile.css'] })
export class ProfileComponent {
  readonly authService = inject(AuthService); private readonly http = inject(HttpClient); private readonly router = inject(Router);
  readonly pestanaActiva = signal<'publicaciones'|'configuracion'>('publicaciones'); readonly apiProfile = signal<ProfileApiUser | null>(null); readonly profileError = signal(''); readonly profileNotice = signal(''); editName = ''; editBio = ''; saving = signal(false);
  readonly profileUser = computed(() => { const session = this.authService.currentUser(); if (!session) return null; const api = this.apiProfile(); return { ...session, name: api?.name || session.name || session.nombre || 'Usuario KEFEX', email: api?.email || session.email || '', rol: api?.rol || session.rol || 'user', avatarUrl: api?.avatar || session.avatarUrl || session.avatar || '', biografia: api?.biografia || session.biografia || '' }; });
  constructor() { this.http.get<{ user: ProfileApiUser }>(`${environment.apiUrl}/usuario/profile`).subscribe({ next: response => { this.apiProfile.set(response.user); this.editName = response.user.name; this.editBio = response.user.biografia || ''; }, error: () => this.profileError.set('No fue posible sincronizar los datos del perfil. Se muestra la información disponible en la sesión.') }); }
  cambiarPestana(tab: 'publicaciones'|'configuracion'): void { this.pestanaActiva.set(tab); }
  saveProfile(): void { this.profileError.set(''); this.profileNotice.set(''); const name = this.editName.trim(); const biografia = this.editBio.trim(); if (!name) { this.profileError.set('El nombre no puede estar vacío.'); return; } if (biografia.length > 280) { this.profileError.set('La biografía no puede superar 280 caracteres.'); return; } this.saving.set(true); this.http.put<{ user: ProfileApiUser; message: string }>(`${environment.apiUrl}/usuario/profile`, { name, biografia }).subscribe({ next: response => { this.apiProfile.set(response.user); this.authService.currentUser.update(current => current ? { ...current, name: response.user.name, nombre: response.user.name, biografia: response.user.biografia || '' } : current); this.profileNotice.set(response.message || 'Perfil actualizado.'); this.saving.set(false); }, error: err => { this.profileError.set(err.error?.error || 'No fue posible guardar el perfil.'); this.saving.set(false); } }); }
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
