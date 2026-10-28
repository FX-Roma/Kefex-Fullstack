import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
export const routes: Routes = [
  { path: '', title: 'KEFEX — Para ti', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'explorar', title: 'KEFEX — Explorar', loadComponent: () => import('./pages/explorer/explorer').then(m => m.ExplorerComponent) },
  { path: 'explorer', title: 'KEFEX — Explorer', loadComponent: () => import('./pages/explorer/explorer').then(m => m.ExplorerComponent) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'foro', title: 'KEFEX — Comunidad', loadComponent: () => import('./pages/foro/foro').then(m => m.ForoComponent) },
  { path: 'login', title: 'KEFEX — Iniciar sesión', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'registro', title: 'KEFEX — Crear cuenta', loadComponent: () => import('./pages/registro/registro').then(m => m.RegistroComponent) },
  { path: 'perfil', title: 'KEFEX — Mi perfil', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent) },
  { path: 'profile', title: 'KEFEX — My profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent) },
  { path: 'admin', title: 'KEFEX — Administración', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent) },
  { path: 'tienda', title: 'KEFEX — Tienda', loadComponent: () => import('./pages/tienda/tienda').then(m => m.TiendaComponent) },
  { path: 'carrito', title: 'KEFEX — Carrito', canActivate: [authGuard], loadComponent: () => import('./pages/carrito/carrito').then(m => m.CarritoComponent) },
  { path: 'favoritos', title: 'KEFEX — Favoritos', canActivate: [authGuard], loadComponent: () => import('./pages/favoritos/favoritos').then(m => m.FavoritosComponent) },
  { path: '**', redirectTo: '' }
];
