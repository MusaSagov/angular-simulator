import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { usePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Preset } from '@primeuix/themes/types';
import { Theme } from '../enums/Theme';
import { IThemeOption } from '../interfaces/IThemeOption';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private localStorageService: LocalStorageService = inject(LocalStorageService);
  private themeNameSubject: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(this.getDefaultTheme());
  private colorModeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getDefaultDarkMode());

  theme$: Observable<Theme> = this.themeNameSubject.asObservable();
  colorMode$: Observable<boolean> = this.colorModeSubject.asObservable().pipe(
    tap((isDark: boolean) => {
      document.documentElement.classList.toggle('my-app-dark', isDark);
      this.localStorageService.saveData<boolean>('theme', isDark);
    })
  );

  isDarkMode$: Observable<boolean> = this.colorMode$;
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
    return this.localStorageService.loadData<Theme>('theme-name') ?? Theme.AURA;
  }

  private getDefaultDarkMode(): boolean {
    return this.localStorageService.loadData<boolean>('dark-mode') ?? false;
  }

  toggleDarkMode(isDark: boolean): void {
    this.colorModeSubject.next(isDark);
  }

  setTheme(theme: Theme): void {
    this.themeNameSubject.next(theme);
    const preset: Preset = this.PRESETS[theme];
    if (preset) usePreset(preset);
    this.localStorageService.saveData<Theme>('theme-name', theme);
  }

}