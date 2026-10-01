import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-designers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './designers.html',
  styleUrl: './designers.css'
})
export class DesignersComponent implements OnInit {
  private http = inject(HttpClient);
  designers = signal<Usuario[]>([]);

  ngOnInit(): void {
    this.http.get<Usuario[]>('http://localhost:3000/api/usuarios/designers').subscribe({
      next: (data) => this.designers.set(data),
      error: () => {
        // Mock estático preservado del proyecto original
        this.designers.set([
          { id: 1, nombre: 'Andrés Galvis', username: 'andres_kefex', profesion: 'UX/UI Designer', avatarUrl: 'assets/Kefex-ph.png', seguidoresCount: 1250 },
          { id: 2, nombre: 'Natalia Reyes', username: 'natareyes', profesion: 'Frontend Engineer', avatarUrl: 'assets/F-Kefex.png', seguidoresCount: 980 }
        ]);
      }
    });
  }
}