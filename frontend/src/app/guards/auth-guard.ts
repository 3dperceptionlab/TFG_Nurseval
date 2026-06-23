import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (allowedRoles.includes('guest')) {
      return auth.isAuthenticated() ? router.createUrlTree(['/app']) : true;
    }

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const role = auth.userRole();
    
    if (allowedRoles.includes(role)) 
      return true;

    if (role === 'guest') 
      return router.createUrlTree(['/login']);

    return router.createUrlTree(['/app']);
  };
};