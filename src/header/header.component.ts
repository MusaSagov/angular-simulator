import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../service/theme.service';
import { Theme } from '../enums/Theme';
import { ColorMode } from '../enums/ColorMode';
import { INavItem } from '../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToggleSwitchChangeEvent, ToggleSwitchModule} from 'primeng/toggleswitch';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLink, SelectButtonModule, ToggleSwitchModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  themeService: ThemeService = inject(ThemeService)
  companyName: string = 'Румтибет';
  currentWidget: 'counter' | 'dateTime' = 'dateTime';
  counter: number = 0;
  formattedDateTime: string = new Date().toLocaleDateString('ru-Ru');

  navItems: INavItem[] = [
    { 
      id: "main-page",
      title: "Главная", 
      link: "/"
    },
    {
      id: "users-page",
      title: "Пользователи", 
      link: "/users-page"
    },
    {
      id: 'posts-page',
      title: 'Posts',
      link: '/posts'
    }
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

}