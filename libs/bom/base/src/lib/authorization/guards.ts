import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService} from '@bk/auth';
import { AuthorizationService } from './authorization.service';

// https://angular.io/api/router/CanActivateFn

export const isAuthenticatedGuard = (): CanActivateFn => {
      return () => {    
        if (inject(AuthService).isAuthenticated() === true) return true;
        console.warn('isAuthenticatedGuard: not authenticated, redirecting to login')
        return inject(Router).parseUrl('/auth/login/bko');
      };
};

export const isPrivilegedGuard = (): CanActivateFn => {
    return () => {
      return inject(AuthorizationService).isPrivileged();
    }
};

export const isAdminGuard = (): CanActivateFn => {
  return () => {
    return inject(AuthorizationService).isAdmin();
  }
};
