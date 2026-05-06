import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { usePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Preset } from '@primeuix/themes/types';
import { ThemeName } from '../enums/Theme';
import { ColorMode } from '../enums/ColorMode';
import { IThemeOption } from '../interfaces/IThemeOption';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private localStorage = inject(LocalStorageService);
  private themeNameSubject = new BehaviorSubject<ThemeName>(this.getDefaultTheme());
  private colorModeSubject = new BehaviorSubject<ColorMode>(this.getDefaultDarkMode());

  themeName$: Observable<ThemeName> = this.themeNameSubject.asObservable();
  colorMode$: Observable<ColorMode> = this.colorModeSubject.asObservable();
  
  isDarkMode$: Observable<boolean> = this.colorMode$.pipe(map((mode) => mode === ColorMode.DARK));
  themeOptions: IThemeOption[] = [
    { label: 'Aura', value: ThemeName.AURA },
    { label: 'Lara', value: ThemeName.LARA },
    { label: 'Nora', value: ThemeName.NORA },
  ];
 
  private readonly PRESETS: Record<ThemeName, Preset> = {
    [ThemeName.AURA]: Aura,
    [ThemeName.LARA]: Lara,
    [ThemeName.NORA]: Nora,
  };

  constructor() {
    this.themeNameSubject
      .pipe(
        tap((theme) => {
          const preset = this.PRESETS[theme];
          if (preset) {
            usePreset(preset);
          }
          this.localStorage.saveData<ThemeName>('theme-name', theme);
        })
      )
      .subscribe();
    this.colorModeSubject
      .pipe(
        tap((mode) => {
          const isDark = mode === ColorMode.DARK;
          document.documentElement.classList.toggle('my-app-dark', isDark);
          this.localStorage.saveData<ColorMode>('theme', mode);
        })
      )
      .subscribe();
  }

  private getDefaultTheme(): ThemeName {
    return this.localStorage.loadData<ThemeName>('theme-name') ?? ThemeName.AURA;
  }

  private getDefaultDarkMode(): ColorMode {
    return this.localStorage.loadData<ColorMode>('theme') ?? ColorMode.DARK;
  }

  switchDarkToLight(isDark: boolean): void {
    this.colorModeSubject.next(isDark ? ColorMode.DARK : ColorMode.LIGHT);
  }

  setTheme(theme: ThemeName): void {
    this.themeNameSubject.next(theme);
  }

}