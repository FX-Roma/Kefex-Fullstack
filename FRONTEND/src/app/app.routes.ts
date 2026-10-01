import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
    {
    path: 'explorer', // <--- Cambiar 'explorar' por 'explorer'
    loadComponent: () => import('./pages/explorer/explorer').then(m => m.ExplorerComponent)
    },
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favoritos/favoritos').then(m => m.FavoritosComponent)
  },
  {
    path: 'foro',
    loadComponent: () => import('./pages/foro/foro').then(m => m.ForoComponent)
  },
  {
    path: 'tienda',
    loadComponent: () => import('./pages/tienda/tienda').then(m => m.TiendaComponent)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then(m => m.CarritoComponent)
  },
  {
    path: 'designers',
    loadComponent: () => import('./pages/designers/designers').then(m => m.DesignersComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];