import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  // Estado reactivo del menú lateral (Sidebar Drawer)
  isSidebarOpen = signal<boolean>(false);

  // Estado para los popups interactivos de desarrolladores (K, F, X)
  activeDeveloper = signal<string | null>(null);

  // Contador de elementos en el carrito
  cartCount = signal<number>(0);

  // Métodos de control del menú lateral
  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(state => !state);
  }

  // Popups Desarrolladores
  toggleDeveloper(dev: string, event: Event): void {
    event.stopPropagation();
    this.activeDeveloper.update(current => (current === dev ? null : dev));
  }

  @HostListener('document:click')
  closeDeveloperPopups(): void {
    this.activeDeveloper.set(null);
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeSidebar();
    this.closeDeveloperPopups();
  }
}