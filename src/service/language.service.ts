import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';
import { Language } from '../enums/Language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  
  readonly supportedLanguages: Language[] = Object.values(Language);
  currentLanguage: Language = Language.EN;

  init(): void {
    const savedLanguage: Language | null = this.localStorageService.getItem<Language>('selected-language');
    const browserLanguage: string | undefined = this.translateService.getBrowserLang();
    
    let language: Language = Language.EN;
    
    if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
      language = savedLanguage;
    } else if (browserLanguage && this.supportedLanguages.includes(browserLanguage as Language)) {
      language = browserLanguage as Language;
    }

    this.currentLanguage = language;
    this.translateService.use(language);
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    this.localStorageService.saveData('selected-language', language);
    this.translateService.use(language);
  }

}