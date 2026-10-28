import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Usuario } from '../../core/models/usuario.model';

@Component({ selector: 'app-designers', standalone: true, imports: [CommonModule], templateUrl: './designers.html', styleUrl: './designers.css' })
export class DesignersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly designers = signal<Usuario[]>([]);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.http.get<{ usuarios: Usuario[] }>(`${environment.apiUrl}/usuarios`).subscribe({
      next: response => this.designers.set(response.usuarios ?? []),
      error: () => this.errorMessage.set('El directorio de usuarios requiere una sesión de administrador.')
    });
  }
}
