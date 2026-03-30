import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { combineLatest, finalize, map, timer } from 'rxjs';
import { LoaderService } from '../service/loader.service';
import { appConfig } from '../app/app.config';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.on();

  const apiCall$ = next(req);

  return combineLatest([apiCall$, timer(2000)]).pipe(
    map(([event, _]) => event),
    finalize(() => loaderService.off())
  );
};