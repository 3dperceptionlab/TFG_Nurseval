import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../services/auth.service';

// Evita disparar varios /refresh.
let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<boolean>(false);

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  // para qeu sepa que en la peticiondebe incluir las cookies.
  const withCreds = req.clone({ withCredentials: true });

  return next(withCreds).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = AUTH_ENDPOINTS.some(path => req.url.includes(path));

      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        // Espera a que termine el refresh en curso y reintenta.
        return refreshDone$.pipe(
          filter(done => done),
          take(1),
          switchMap(() => next(withCreds))
        );
      }

      isRefreshing = true;
      refreshDone$.next(false);

      return auth.refreshSession().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshDone$.next(true);
          return next(withCreds);
        }),
        catchError(refreshError => {
          isRefreshing = false;
          refreshDone$.next(true);
          return throwError(() => refreshError);
        })
      );
    })
  );
};