import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const addTokenToRequest = (): HttpRequest<unknown> => req.clone({
    setHeaders: {
      Authorization: `Bearer ${ authService.getAccessToken() }`,
    },
  });

  const logoutAndGoToLogin = (): Observable<never> => {authService.logout(); router.navigate(['/login']);
    return EMPTY;
  };

  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const request: HttpRequest<unknown> = authService.getAccessToken() ? addTokenToRequest() : req;

  return next(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => error);
        }

        if (!authService.getRefreshToken()) {
          return logoutAndGoToLogin();
        }

        return authService.refreshToken().pipe(
          switchMap(() => next(addTokenToRequest())),
          catchError(() => logoutAndGoToLogin())
        );
      })
    );
    
};