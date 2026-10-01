import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: string | number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  isScrolled = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  unreadNotifications = signal<number>(3);

  navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio', icon: 'home', route: '/' },
    { id: 'explorer', label: 'Explorar', icon: 'compass', route: '/explorer' },
    { id: 'foro', label: 'Foro', icon: 'message-square', route: '/foro', badge: 'En Vivo' },
    { id: 'tienda', label: 'Tienda', icon: 'shopping-bag', route: '/tienda' },
    { id: 'designers', label: 'Diseñadores', icon: 'users', route: '/designers' }
  ];

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v: boolean) => !v);
  }
}