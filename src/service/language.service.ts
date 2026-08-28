import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';
import { Language } from '../enums/Language';
import { PrimeNG } from 'primeng/config';
import { primeTranslations } from '../app/constants/prime-translations';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly primeNG: PrimeNG = inject(PrimeNG);

  readonly supportedLanguages: Language[] = Object.values(Language);

  init(): void {
    const savedLanguage: Language | null = this.localStorageService.getItem<Language>('selected-language');
    const browserLanguage: string | undefined  = this.translateService.getBrowserLang();
    let language: Language = Language.En;
        if (savedLanguage && this.isSupportedLanguage(savedLanguage)) {
          language = savedLanguage;
        } else if (this.isSupportedLanguage(browserLanguage)) {
          language = browserLanguage;
        }

    this.translateService.use(language);
    this.primeNG.setTranslation(primeTranslations[language]);
  }

  setLanguage(language: string): void {
    if (!this.isSupportedLanguage(language)) {
      return;
    }

    this.localStorageService.saveData('selected-language', language);
    this.translateService.use(language);
    this.primeNG.setTranslation(primeTranslations[language]);
  }

  private isSupportedLanguage(language: string | undefined): language is Language {
    return Object.values(Language).includes(language as Language);
  }

}