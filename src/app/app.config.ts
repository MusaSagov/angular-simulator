import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { routes } from './app.routes';
import { Theme } from '../enums/Theme';
import { provideRouter } from '@angular/router';
import { Preset } from '@primeuix/themes/types';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { authInterceptor } from '../features/auth/auth.interceptor';
import { AuthService } from '../features/auth/auth.service';
import { APPLICATION_CONFIG } from '../application-config.token';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageService } from '../service/language.service';

const getTheme = (): Preset => {
  const themeMap: Record<Theme, Preset> = {
    [Theme.AURA]: Aura,
    [Theme.LARA]: Lara,
    [Theme.NORA]: Nora,
  };
  const themeFromStorage: string | null = localStorage.getItem('theme-name');
  const savedTheme: Theme = themeFromStorage ? JSON.parse(themeFromStorage) : Theme.AURA;
  return themeMap[savedTheme] ?? Aura;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      })
    }),
    provideAppInitializer(() => {
      const authService: AuthService = inject(AuthService);
      return authService.initAuth();
    }),
    provideAppInitializer(() => {
      const languageService: LanguageService = inject(LanguageService);
      languageService.init();
    }),
    MessageService,
    {
      provide: APPLICATION_CONFIG,
      useValue: {
        companyName: 'РУМТИБЕТ',
        enableLogs: true,
        enableNotifications: true,
        enableTheming: true,
        sessionTimeout: 1,
      },
    },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: 'dd.MM.yyyy HH:mm',
      },
    },
    providePrimeNG({
      theme: {
        preset: getTheme(),
        options: {
          darkModeSelector: '.my-app-dark'
        }
      },
      translation: {
        accept: 'Accept',
        reject: 'Reject',
        cancel: 'Cancel',
        today: 'Today',
        clear: 'Clear',
        firstDayOfWeek: 0,
      },
    }),
  ]
};