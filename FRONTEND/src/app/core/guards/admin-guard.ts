import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const adminGuard: CanActivateFn = (_route, state) => {
  if (typeof window === 'undefined') return true;
  const auth = inject(AuthService); const router = inject(Router);
  if (!auth.isAuthenticated()) return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  return auth.getUserRole() === 'admin' ? true : router.createUrlTree(['/']);
};
