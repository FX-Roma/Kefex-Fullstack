
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [FormsModule],
  selector: 'app-recover',
  styleUrl: './recover.css',
  templateUrl: './recover.html',
})
export class Recover {
  private readonly authService = inject(AuthService);

  email = signal('');
  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  recuperarPassword(): void {
    if (!this.email().trim()) {
      this.error.set('Por favor ingresa tu correo electrónico.');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.authService.forgotPassword(this.email().trim()).subscribe({
      next: (respuesta) => {
        this.mensaje.set(respuesta.message);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo procesar la solicitud.');
        this.cargando.set(false);
      }
    });
  }
}

