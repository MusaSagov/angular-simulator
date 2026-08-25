import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';

export type Language = 'ru' | 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);

  readonly supportedLanguages: Language[] = [
    'ru',
    'en',
    'es',
  ];

  init(): void {
    const savedLanguage: Language | null = this.localStorageService.getItem<Language>('selected-language');
    const browserLanguage: Language = this.translateService.getBrowserLang() as Language;
    const language: Language = savedLanguage && this.supportedLanguages.includes(savedLanguage)
        ? savedLanguage
        : this.supportedLanguages.includes(browserLanguage)
        ? browserLanguage
        : 'en';

    this.translateService.use(language);
  }

  setLanguage(language: string): void {
    if (!this.supportedLanguages.includes(language as Language)) {
      return;
    }

    this.localStorageService.saveData('selected-language', language);
    this.translateService.use(language);
  }

}