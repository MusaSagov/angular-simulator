import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { routes } from './app.routes';
import { Theme } from '../enums/Theme';
import { provideRouter } from '@angular/router';
import { Preset } from '@primeuix/themes/types';
import { provideHttpClient } from '@angular/common/http';

const getTheme = (): Preset => {
  const themeMap: Record<Theme, Preset> = {
    [Theme.AURA]: Aura,
    [Theme.LARA]: Lara,
    [Theme.NORA]: Nora,
  };
  const themeFromStorage = localStorage.getItem('theme-name');
  const savedTheme: Theme = themeFromStorage ? JSON.parse(themeFromStorage) : Theme.AURA;
  return themeMap[savedTheme] ?? Aura;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: getTheme(),
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    }),
  ]
};