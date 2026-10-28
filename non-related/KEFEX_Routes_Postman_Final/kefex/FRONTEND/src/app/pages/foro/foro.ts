import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForoService } from '../../core/services/foro.service';
import { AuthService } from '../../core/services/auth.service';
import { ForoPost, Comentario } from '../../core/models/foro.model';
@Component({ selector: 'app-foro', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './foro.html', styleUrls: ['./foro.css'] })
export class ForoComponent implements OnInit {
  private readonly foroService = inject(ForoService); readonly auth = inject(AuthService); readonly hilos = signal<ForoPost[]>([]); readonly categoriaFiltro = signal('todos'); readonly errorMessage = signal(''); readonly activeThread = signal<string | number | null>(null); readonly commentsByThread = signal<Record<string, Comentario[]>>({}); commentDraft = ''; readonly loading = signal(true); readonly modalCrearAbierto = signal(false); nuevoTitulo = ''; nuevoContenido = ''; nuevaCategoria = 'General'; nuevaPuntuacion = 5;
  ngOnInit(): void { this.cargarHilos(); }
  cargarHilos(): void { this.loading.set(true); this.foroService.obtenerHilos().subscribe({ next: posts => { this.hilos.set(posts); this.loading.set(false); }, error: () => { this.errorMessage.set('No fue posible conectar con las discusiones. Puedes volver a intentarlo.'); this.loading.set(false); } }); }
  threadKey(id: string | number): string { return String(id); }
  toggleComments(thread: ForoPost): void { if (this.activeThread() === thread.id) { this.activeThread.set(null); return; } this.activeThread.set(thread.id); this.commentDraft = ''; const key = String(thread.id); if (this.commentsByThread()[key]) return; this.foroService.obtenerComentarios(thread.id).subscribe({ next: comments => this.commentsByThread.update(current => ({ ...current, [key]: comments })), error: () => this.errorMessage.set('No fue posible cargar los comentarios de esta conversación.') }); }
  submitComment(thread: ForoPost): void { if (!this.auth.isAuthenticated()) { this.errorMessage.set('Inicia sesión para comentar.'); return; } const text = this.commentDraft.trim(); if (!text) return; this.foroService.agregarComentario(thread.id, text).subscribe({ next: comment => { const key = String(thread.id); this.commentsByThread.update(current => ({ ...current, [key]: [...(current[key] || []), comment] })); this.hilos.update(posts => posts.map(post => post.id === thread.id ? { ...post, comentariosCount: post.comentariosCount + 1 } : post)); this.commentDraft = ''; }, error: () => this.errorMessage.set('No fue posible publicar el comentario.') }); }
  crearNuevoHilo(): void { if (!this.auth.isAuthenticated()) { this.errorMessage.set('Inicia sesión para publicar una discusión.'); return; } if (!this.nuevoTitulo.trim() || !this.nuevoContenido.trim()) { this.errorMessage.set('Completa el título y el contenido.'); return; } const authorName = this.auth.currentUser()?.name || this.auth.currentUser()?.nombre || 'Miembro KEFEX'; this.foroService.crearHilo({ titulo: this.nuevoTitulo.trim(), contenido: this.nuevoContenido.trim(), categoria: this.nuevaCategoria, authorName, score: this.nuevaPuntuacion }).subscribe({ next: post => { this.hilos.update(posts => [post, ...posts]); this.cerrarModal(); this.errorMessage.set(''); }, error: () => this.errorMessage.set('No fue posible publicar el hilo. Revisa la conexión con la API.') }); }
  abrirModal(): void { if (!this.auth.isAuthenticated()) { this.errorMessage.set('Inicia sesión para crear un hilo.'); return; } this.modalCrearAbierto.set(true); }
  cerrarModal(): void { this.modalCrearAbierto.set(false); this.nuevoTitulo = ''; this.nuevoContenido = ''; }
}
