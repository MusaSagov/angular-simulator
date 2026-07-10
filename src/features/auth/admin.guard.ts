import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from '../../enums/Role';
import { IAuthUser } from './interfaces';

export const adminGuard: CanActivateFn = () => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const user: IAuthUser | null = authService.getCurrentUser();

  if (!user) {
    return router.parseUrl('/login');
  }

  if (user.role !== Role.ADMIN) {
    return router.parseUrl('/');
  }

  return true;

};
