import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { usePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Preset } from '@primeuix/themes/types';
import { Theme } from '../enums/Theme';
import { ColorMode } from '../enums/ColorMode';
import { IThemeOption } from '../interfaces/IThemeOption';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private localStorage: LocalStorageService = inject(LocalStorageService);
  private themeNameSubject: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(this.getDefaultTheme());
  private colorModeSubject: BehaviorSubject<ColorMode> = new BehaviorSubject<ColorMode>(this.getDefaultDarkMode());

  themeName$: Observable<Theme> = this.themeNameSubject.asObservable().pipe(
    tap((theme) => {
      const preset: Preset = this.PRESETS[theme];
      if (preset) {
        usePreset(preset);
      }
      this.localStorage.saveData<Theme>('theme-name', theme);
    })
  );

  colorMode$: Observable<ColorMode> = this.colorModeSubject.asObservable().pipe(
    tap((mode) => {
      const isDark: boolean = mode === ColorMode.DARK;
      document.documentElement.classList.toggle('my-app-dark', isDark);
      this.localStorage.saveData<ColorMode>('theme', mode);
    })
  );
  
  isDarkMode$: Observable<boolean> = this.colorMode$.pipe(map((mode) => mode === ColorMode.DARK));
  themeOptions: IThemeOption[] = [
    { label: 'Aura', value: Theme.AURA },
    { label: 'Lara', value: Theme.LARA },
    { label: 'Nora', value: Theme.NORA },
  ];
 
  private readonly PRESETS: Record<Theme, Preset> = {
    [Theme.AURA]: Aura,
    [Theme.LARA]: Lara,
    [Theme.NORA]: Nora,
  };

  private getDefaultTheme(): Theme {
    return this.localStorage.loadData<Theme>('theme-name') ?? Theme.AURA;
  }

  private getDefaultDarkMode(): ColorMode {
    return this.localStorage.loadData<ColorMode>('theme') ?? ColorMode.DARK;
  }

  toggleDarkMode(isDark: boolean): void {
    this.colorModeSubject.next(isDark ? ColorMode.DARK : ColorMode.LIGHT);
  }

  setTheme(theme: Theme): void {
    this.themeNameSubject.next(theme);
  }

}