import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

/** Adds the session token only to KEFEX API calls. */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (typeof window === 'undefined') return next(request);
  const token = window.localStorage.getItem('token');
  const isKefexApi = request.url.startsWith(environment.apiUrl) || request.url.startsWith('/api/');
  if (!token || !isKefexApi || request.headers.has('Authorization')) return next(request);
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
