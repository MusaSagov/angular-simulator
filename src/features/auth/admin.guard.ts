import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from '../../enums/Role';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();

  if (!user) {
    return router.parseUrl('/login');
  }

  if (user.role !== Role.ADMIN) {
    return router.parseUrl('/');
  }

  return true;

};
