import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.service';
import { inject } from '@angular/core';


export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(Auth);
    const router = inject(Router);
    
    const currentRole = authService.userRole();

    // permitir si coincide
    if (allowedRoles.includes(currentRole)) {
      return true;
    }

    // sino mandar al login
    if (currentRole === 'guest') {
      return router.createUrlTree(['/login']);
    }

    // si esta autenticado pero no es el usuario correcto mandar a un sitio seguro
    return router.createUrlTree(['/app']);
  };
};
