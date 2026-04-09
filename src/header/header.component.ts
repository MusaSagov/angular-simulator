import { Component } from '@angular/core';
import { ILocation, INavItem, IParticipant } from '../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

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
}