import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Credential } from '../../core/models/credential';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isSubmitting = false;
  readonly isAdminLogin = this.router.url.startsWith('/admin/login');

  credentialsForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  handleSubmit(): void {
    this.errorMessage = '';
    this.errorMessage = '';
    if (this.credentialsForm.valid) {
      const username = this.credentialsForm.value.username;
      const password = this.credentialsForm.value.password;

      if (typeof username === 'string' && typeof password === 'string') {
        const credential: Credential = { username, password };

        this.isSubmitting = true;
        this.isSubmitting = true;
        const loginRequest = this.isAdminLogin
          ? this.authService.loginAdmin(credential)
          : this.authService.login(credential);
        loginRequest.subscribe({
          next: (response) => {
            this.isSubmitting = false;
            if (response.result === 'fine' && response.data) {
              this.authService.setToken(response.data);
              const decoded = this.authService.decodeToken(response.data);

              const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
              if (returnUrl && typeof returnUrl === 'string' && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) { this.router.navigateByUrl(returnUrl); }
              else if (decoded?.rol === 'admin') { this.router.navigateByUrl('/admin'); }
              else { this.router.navigateByUrl('/'); }
            } else {
              this.errorMessage = response.message || 'Error al iniciar sesión';
            }
          },
          error: (err) => {
            this.isSubmitting = false;
            this.errorMessage = err.error?.message || 'Error de conexión con el servidor.';
          }
        });
      }
    } else {
      this.errorMessage = 'Por favor completa todos los campos requeridos correctamente.';
    }
  }
}