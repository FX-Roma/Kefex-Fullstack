import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem { id: string; label: string; icon: string; route: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  auth = inject(AuthService);
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  authOpen = signal(false);
  authMode = signal<'login' | 'register'>('login');
  loading = signal(false);
  authMessage = signal('');

  loginData = { identificador: '', contrasena: '' };
  registerData = { nombre: '', username: '', correo: '', contrasena: '' };

  navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio', icon: 'home', route: '/' },
    { id: 'designers', label: 'Diseñadores', icon: 'users', route: '/designers' }
  ];

  @HostListener('window:scroll') onWindowScroll(): void { this.isScrolled.set(window.scrollY > 20); }
  closeMobileMenu(): void { this.isMobileMenuOpen.set(false); }
  toggleMobileMenu(): void { this.isMobileMenuOpen.update(v => !v); }
  toggleAuth(): void { this.authOpen.update(v => !v); this.authMessage.set(''); }
  closeAuth(): void { this.authOpen.set(false); this.authMessage.set(''); }
  showRegister(): void { this.authMode.set('register'); this.authMessage.set(''); }
  showLogin(): void { this.authMode.set('login'); this.authMessage.set(''); }

  submitLogin(): void {
    this.loading.set(true); this.authMessage.set('');
    this.auth.login(this.loginData).subscribe({
      next: () => { this.loading.set(false); this.closeAuth(); },
      error: err => { this.loading.set(false); this.authMessage.set(err?.error?.mensaje || 'No fue posible iniciar sesión.'); }
    });
  }

  submitRegister(): void {
    this.loading.set(true); this.authMessage.set('');
    this.auth.register(this.registerData).subscribe({
      next: () => { this.loading.set(false); this.closeAuth(); },
      error: err => { this.loading.set(false); this.authMessage.set(err?.error?.mensaje || 'No fue posible crear la cuenta.'); }
    });
  }

  logout(): void { this.auth.logout(); this.closeAuth(); }
}
