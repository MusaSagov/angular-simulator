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
  selectedLocation!: string;
  selectedDate!: string;
  selectedCount!: string;
  liveText: string = '';
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

  locations: ILocation[] = [
    { id: 1, name: 'Россия' },
    { id: 2, name: 'Украина' },
    { id: 3, name: 'Беларусь' }
  ];

  participants: IParticipant[] = [
    { id: 1, value: '4 человека', quantity: 4 },
    { id: 2, value: '5 человек', quantity: 5 },
    { id: 3, value: '6 человек', quantity: 6 }
  ];

  constructor() {
    setInterval(() => {
      this.formattedDateTime = new Date().toLocaleString('ru-RU');
    }, 1000);
  }

  onSearchSubmit(form: NgForm): void {}

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