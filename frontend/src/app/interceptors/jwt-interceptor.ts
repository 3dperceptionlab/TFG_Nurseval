import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../services/auth.service';

// Evita disparar varios /refresh.
let isRefreshing = false;


const refreshDone$ = new BehaviorSubject<boolean | null>(null);
// Rutas que no deben ser interceptadas
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  // antes de enviar la peticion, le emte las cookies. Se lo aplica a todas, pero el backend ignorara a los que no tiene en su filtro (publicas)
  const withCreds = req.clone({ withCredentials: true });

  // se disprara  la peticion y a la vuelta el pipe lo intercepta
  return next(withCreds).pipe(
    catchError((error: HttpErrorResponse) => {
      // Verificamos si el error ocurrió en una ruta de autenticación.
      const isAuthEndpoint = AUTH_ENDPOINTS.some(path => req.url.includes(path));

      // Si el error NO es un 401 (token caducado) o si estamos intentando hacer login/refresh, no intervenimos.
      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }
      // Si otra petición ya disparó el refresco, pausamos esta petición
      if (isRefreshing) {
        return refreshDone$.pipe(
          filter(result => result !== null),
          // Cuando deje de ser null, tomamos el valor  y cerramos la suscripción
          take(1),
          // Si fue exitoso (true), reintentamos la petición original. Si falló (false), devolvemos error.
          switchMap(success => success ? next(withCreds) : throwError(() => error))
        );
      }
      // primera peticion
      isRefreshing = true;
      refreshDone$.next(null);//reiniiciar la espera

      return auth.refreshSession().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshDone$.next(true);
          return next(withCreds);
        }),
        catchError(refreshError => {
          isRefreshing = false;
          refreshDone$.next(false);
          return throwError(() => refreshError);
        })
      );
    })
  );
};