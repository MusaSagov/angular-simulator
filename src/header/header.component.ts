import { Component, inject } from '@angular/core';
import { ThemeService } from '../service/theme.service';
import { Theme } from '../enums/Theme';
import { INavItem } from '../interfaces';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from '../features/auth/auth.service';
import { Observable } from 'rxjs';
import { IAuthUser } from '../features/auth/interfaces';
import { APPLICATION_CONFIG } from '../application-config.token';
import { IApplicationConfig } from '../interfaces/IApplicationConfig';
import { LanguageService } from '../service/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Select } from 'primeng/select';
import { Language } from '../enums/Language';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Select, FormsModule, RouterLinkActive, RouterLink, SelectButtonModule, ToggleSwitchModule, AsyncPipe, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly appConfig: IApplicationConfig = inject(APPLICATION_CONFIG);
  languageService: LanguageService = inject(LanguageService);

  themeService: ThemeService = inject(ThemeService);
  currentWidget: 'counter' | 'dateTime' = 'dateTime';
  counter: number = 0;
  formattedDateTime: string = new Date().toLocaleDateString('ru-Ru');
  lastLoginDate: Date | null = new Date();
  
  user$: Observable<IAuthUser | null>= this.authService.user$;

  languages: { code: Language; label: string }[] = [
    { code: Language.RU, label: 'RU' },
    { code: Language.EN, label: 'EN' },
    { code: Language.ES, label: 'ES' },
  ];

  selectedLanguage: Language = this.languageService.currentLanguage;

  navItems: INavItem[] = [
    { 
      id: 'main-page',
      title: 'Главная', 
      link: '/'
    },
    {
      id: 'users-page',
      title: 'Пользователи', 
      link: '/users-page'
    },
    {
      id: 'posts-page',
      title: 'Posts',
      link: '/posts'
    },
  ];
  
  constructor() {
    setInterval(() => {
      this.formattedDateTime = new Date().toLocaleString('ru-RU');
    }, 1000);
  }

  setWidget(widget: 'counter' | 'dateTime'): void {
    this.currentWidget = widget;
  }

  incrementCounter(): void {
    this.counter++;
  }

  decrementCounter(): void {
    if (this.counter > 0) {
      this.counter--;
    }
  }

  toggleMode(event: ToggleSwitchChangeEvent): void {
    const isDark: boolean = event.checked;
    this.themeService.toggleDarkMode(isDark);
  }

  toggleTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get companyName(): string {
    return this.appConfig.companyName;
  }

  get enableTheming(): boolean {
    return this.appConfig.enableTheming;
  }

  changeLanguage(language: Language): void {
    this.selectedLanguage = language;
    this.languageService.setLanguage(language);
  }

}