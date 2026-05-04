import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { routes } from './app.routes';
import { ThemeName } from '../enums/Theme';
import { Preset } from '@primeuix/themes/types';
import { provideRouter } from '@angular/router';

const themeMap: Record<string, Preset> = {
  [ThemeName.AURA]: Aura,
  [ThemeName.LARA]: Lara,
  [ThemeName.NORA]: Nora,
};

function getTheme(): Preset {
  const value: string | null = localStorage.getItem('my-app-theme');
  const theme: string | null = value ? JSON.parse(value) : null;
  return theme && themeMap[theme] ? themeMap[theme] : Aura;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection(),
    providePrimeNG({
      theme: {
        preset: getTheme(),
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    })
  ]
};