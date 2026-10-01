import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {
  authService = inject(AuthService);
  pestanaActiva = 'publicaciones';

  cambiarPestana(pestana: string): void {
    this.pestanaActiva = pestana;
  }
}