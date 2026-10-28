import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({ selector: 'app-registro', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './registro.html', styleUrls: ['./registro.css'] })
export class RegistroComponent {
  private readonly auth = inject(AuthService); private readonly router = inject(Router);
  errorMessage = ''; successMessage = ''; isSubmitting = false;
  readonly form = new FormGroup({ name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)] }), email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }), password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }), confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }) });
  submit(): void {
    this.errorMessage = ''; this.successMessage = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); this.errorMessage = 'Revisa los campos marcados antes de continuar.'; return; }
    const { name, email, password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) { this.errorMessage = 'Las contraseñas no coinciden.'; return; }
    this.isSubmitting = true;
    this.auth.register({ name: name.trim(), email: email.trim(), password }).subscribe({ next: () => { this.isSubmitting = false; this.successMessage = 'Cuenta creada. Ya puedes iniciar sesión.'; setTimeout(() => this.router.navigate(['/login']), 900); }, error: err => { this.isSubmitting = false; this.errorMessage = err.error?.message || 'No fue posible crear la cuenta. Inténtalo de nuevo.'; } });
  }
}
