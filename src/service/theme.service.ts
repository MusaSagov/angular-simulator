import { inject, Injectable } from '@angular/core';
import { usePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { BehaviorSubject, distinctUntilChanged, Observable, tap } from 'rxjs';
import { Preset } from '@primeuix/themes/types';
import { ThemeName } from '../enums/Theme';
import { ColorMode } from '../enums/ColorMode';
import { IThemeChoice } from '../interfaces/IThemeChoice';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeName: ThemeName =
    (localStorage.getItem('my-app-theme') ? JSON.parse(localStorage.getItem('my-app-theme')!) : ThemeName.AURA) as ThemeName;
  private stateSubject = new BehaviorSubject<{
    theme: ThemeName;
    colorMode: ColorMode;
  }>({
    theme: this.themeName,
    colorMode: (document.documentElement.classList.contains('my-app-dark')
      ? ColorMode.Dark
      : ColorMode.Light),
  });

  state$: Observable<{ theme: ThemeName; colorMode: ColorMode }> =
    this.stateSubject.asObservable();

  themes: IThemeChoice[] = [
    { label: 'Aura', value: ThemeName.AURA },
    { label: 'Lara', value: ThemeName.LARA },
    { label: 'Nora', value: ThemeName.NORA },
  ];
  
  constructor() {
    this.stateSubject
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev.theme === curr.theme && prev.colorMode === curr.colorMode
        ),
        tap((state) => {
          this.apply(state);
        })
      )
      .subscribe();
  }

  get state(): { theme: ThemeName; colorMode: ColorMode } {
    return this.stateSubject.value;
  }

  setTheme(theme: ThemeName): void {
    const next = { ...this.state, theme };
    this.stateSubject.next(next);
    localStorage.setItem('my-app-theme', JSON.stringify(theme));
  }

  setColorMode(colorMode: ColorMode): void {
    const next = { ...this.state, colorMode };
    this.stateSubject.next(next);
    this.apply(next);
  }

  toggleColorMode(): void {
    this.setColorMode(
      this.state.colorMode === ColorMode.Light
        ? ColorMode.Dark
        : ColorMode.Light
    );
  }

  private apply(state: { theme: ThemeName; colorMode: ColorMode }): void {
    const presetMap: Record<ThemeName, Preset> = {
      [ThemeName.AURA]: Aura,
      [ThemeName.LARA]: Lara,
      [ThemeName.NORA]: Nora,
    };
    const preset: Preset = presetMap[state.theme];
    if (preset) {      
      usePreset(preset)
    }
  }
  
}