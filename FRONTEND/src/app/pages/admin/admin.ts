import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { AuthService } from '../../core/services/auth.service';

interface AdminUser { _id?: string; id?: string; name: string; email: string; rol: 'user' | 'admin'; estado?: string; createdAt?: string; }
interface AdminPublication { _id: string; contenido: string; categoria: string; autor?: { name?: string }; createdAt?: string; }
interface AdminComment { _id: string; texto: string; autor?: { nombre?: string }; opinion?: string; createdAt?: string; }

@Component({ selector: 'app-admin', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin.html', styleUrls: ['./admin.css'] })
export class AdminComponent {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  readonly users = signal<AdminUser[]>([]);
  readonly publications = signal<AdminPublication[]>([]);
  readonly comments = signal<AdminComment[]>([]);
  readonly loading = signal(true);
  readonly moderationLoading = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly serverStatus = signal<'checking' | 'online' | 'offline'>('checking');
  readonly selectedTab = signal<'overview' | 'users' | 'moderation'>('overview');
  readonly showCreateUser = signal(false);
  newUser = { name: '', email: '', password: '' };

  constructor() { this.loadUsers(); this.loadModeration(); this.checkServer(); }
  get admins(): number { return this.users().filter(user => user.rol === 'admin').length; }
  get activeUsers(): number { return this.users().filter(user => user.estado !== 'inactivo').length; }
  selectTab(tab: 'overview' | 'users' | 'moderation'): void { this.selectedTab.set(tab); }
  isCurrentUser(user: AdminUser): boolean { const currentId = this.auth.currentUser()?.id; return Boolean(currentId && currentId === (user._id || user.id)); }
  toggleCreateUser(): void { this.showCreateUser.update(value => !value); }

  loadUsers(): void {
    this.error.set('');
    this.loading.set(true);
    this.http.get<{ users: AdminUser[] }>(`${environment.apiUrl}/usuario/admin/all`).subscribe({
      next: response => { this.users.set(response.users ?? []); this.loading.set(false); },
      error: err => { this.error.set(err.error?.error || 'No fue posible cargar los usuarios. Verifica que tu cuenta tenga rol admin.'); this.loading.set(false); }
    });
  }
  loadModeration(): void {
    this.moderationLoading.set(true);
    this.http.get<{ publicaciones?: AdminPublication[] }>(`${environment.apiUrl}/publicaciones`).subscribe({
      next: response => this.publications.set(response.publicaciones ?? []),
      error: () => this.error.set('No fue posible cargar las publicaciones para moderación.')
    });
    this.http.get<{ data?: AdminComment[] }>(`${environment.apiUrl}/comments`).subscribe({
      next: response => { this.comments.set(response.data ?? []); this.moderationLoading.set(false); },
      error: () => { this.comments.set([]); this.moderationLoading.set(false); this.error.set('No fue posible cargar los comentarios para moderación.'); }
    });
  }
  checkServer(): void {
    this.http.get<{ status: string }>(`${environment.apiUrl}/health`).subscribe({ next: response => this.serverStatus.set(response.status === 'ok' ? 'online' : 'offline'), error: () => this.serverStatus.set('offline') });
  }
  createUser(): void {
    const payload = { name: this.newUser.name.trim(), email: this.newUser.email.trim().toLowerCase(), password: this.newUser.password };
    if (!payload.name || !payload.email || payload.password.length < 8) { this.error.set('Completa nombre, correo y contraseña de al menos 8 caracteres.'); return; }
    this.http.post(`${environment.apiUrl}/usuarios`, payload).subscribe({
      next: () => { this.notice.set('Usuario creado correctamente.'); this.error.set(''); this.newUser = { name: '', email: '', password: '' }; this.showCreateUser.set(false); this.loadUsers(); },
      error: err => this.error.set(err.error?.message || 'No fue posible crear el usuario. Comprueba permisos y datos.')
    });
  }
  toggleUserStatus(user: AdminUser): void {
    const id = user._id || user.id; if (!id) return;
    const estado = user.estado === 'inactivo' ? 'activo' : 'inactivo';
    this.http.put(`${environment.apiUrl}/usuarios/${id}`, { estado }).subscribe({ next: () => { this.notice.set(`Estado actualizado: ${estado}.`); this.loadUsers(); }, error: () => this.error.set('No fue posible actualizar el estado del usuario.') });
  }
  deleteUser(user: AdminUser): void {
    const id = user._id || user.id; if (!id) return;
    if (typeof window !== 'undefined' && !window.confirm(`¿Eliminar la cuenta ${user.email}? Esta acción no se puede deshacer.`)) return;
    this.http.delete(`${environment.apiUrl}/usuarios/${id}`).subscribe({ next: () => { this.notice.set('Usuario eliminado.'); this.loadUsers(); }, error: () => this.error.set('No fue posible eliminar el usuario.') });
  }
  deletePublication(publication: AdminPublication): void {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar esta publicación?')) return;
    this.http.delete(`${environment.apiUrl}/publicaciones/${publication._id}`).subscribe({ next: () => { this.publications.update(items => items.filter(item => item._id !== publication._id)); this.notice.set('Publicación eliminada.'); }, error: () => this.error.set('No fue posible eliminar la publicación.') });
  }
  deleteComment(comment: AdminComment): void {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar este comentario?')) return;
    this.http.delete(`${environment.apiUrl}/comments/${comment._id}`).subscribe({ next: () => { this.comments.update(items => items.filter(item => item._id !== comment._id)); this.notice.set('Comentario eliminado.'); }, error: () => this.error.set('No fue posible eliminar el comentario.') });
  }
}
