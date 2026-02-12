import { Component } from '@angular/core';
import { Color } from '../enums/Color';
import { Collection } from './collection';
import { CommonModule } from '@angular/common';
import { IOffer } from '../interfaces/IOffer';
import { FormsModule, NgForm } from '@angular/forms';
import { IParticipant } from '../interfaces/IParticipant';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  companyName: string = 'Румтибет';
  isLoading: boolean = true;
  liveText: string = '';

  gallerySlides: ISlide[] = [
    {
      id: 1,
      icon: 'mountain-lake',
      title: 'Горное озеро'
    },
    {
      id: 2,
      icon: 'mountain-canyon',
      title: 'Горный каньон' 
    },
    {
      id: 3,
      icon: 'winter-mountains',
      title: 'Зимние горы'
    },
    {
      id: 4,
      icon: 'mountain-fields',
      title: 'Предгорья'
    }
  ];

  navItems: INavItem[] = [
    {
      id: "nav-main-page",
      title: "Главная",
      link: "#"
    },
    {
      id: "nav-guide-info",
      title: "Про гида",
      link: "#"
    },
    {
      id: "nav-tour-program",
      title: "Программа тура",
      link: "#"
    },
    {
      id: "nav-pricing",
      title: "Стоимость",
      link: "#"
    },
    {
    id: "nav-blog",
    title: "Блог",
    link: "#"
    },
    {
      id: "nav-contacts",
      title: "Контакты",
      link: "#"
    }
  ];

  offers: IOffer[] = [
    {
      id: 1,
      title:'Опытный гид',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      icon: 'guide-icon'
    },
    {
      id: 2,
      title:'Безопасный поход',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      icon: 'safety-icon'
    },
    {
      id: 3,
      title:'Лояльные цены',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      icon: 'discount-icon'
    }
  ];

  locations: ILocation[] = [
    { id: 1, name: 'Россия' },
    { id: 2, name: 'Украина' },
    { id: 3, name: 'Беларусь' }
  ];

  formData: ISearchForm = {
    locationId: 0,
    date: '',
    participants: 0,
    locationName: '',
    participantsCount: '',
    participantsName: ''
  };

  participants: IParticipant[] = [
    { id: 1, value: '4 человека', quantity: 4 },
    { id: 2, value: '5 человек', quantity: 5 },
    { id: 3, value: '6 человек', quantity: 6 }
  ];

  locationSearch: string = '';
  filteredLocations: ILocation[] = [];
  selectedDate: string = '';
  currentTime: Date = new Date();
  currentTask: 'counter' | 'dateTime' = 'dateTime';
  dateTime: Date = new Date();
  counter: number = 0;
  formattedDateTime: string = '';
  
  private wordCollection: Collection<string> = new Collection<string>([]);
  private numberCollection: Collection<number> = new Collection<number>([]);

  constructor() {
    this.initCollections();

    const isRedPrimary: boolean = this.isPrimaryColor(Color.RED);
    const isBlackPrimary: boolean = this.isPrimaryColor(Color.BLACK);
    const isBluePrimary: boolean = this.isPrimaryColor(Color.BLUE);
    const isWhitePrimary: boolean = this.isPrimaryColor(Color.WHITE);

    this.saveLastVisitDate();
    this.saveVisitCount();
    
    setInterval(() => {
      if (this.currentTask === 'dateTime') {
        this.formattedDateTime = new Date().toLocaleString('ru-RU');
      }
    }, 1000);

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  isPrimaryColor(color: Color): boolean {
    const primaryColors: Color[] = [
      Color.RED,
      Color.GREEN,
      Color.BLUE
    ];
    return primaryColors.includes(color);
  }

  initCollections(): void {
    localStorage.setItem('words', JSON.stringify(['кот', 'собака', 'дом']));
    localStorage.setItem('numbers', JSON.stringify([10, 20, 30]));
    
    this.wordCollection = new Collection<string>(
      JSON.parse(localStorage.getItem('words') || '[]')
    );
    this.numberCollection = new Collection<number>(
      JSON.parse(localStorage.getItem('numbers') || '[]')
    );
  }
  
  saveLastVisitDate(): void {
    const now: string = new Date().toISOString();
    localStorage.setItem('lastVisit', now);
  }

  saveVisitCount(): void {
    const currentCount: number = parseInt(localStorage.getItem('visitCount') || '0') || 0;
    const newCount: number = currentCount + 1;
    localStorage.setItem('visitCount', newCount.toString());
  }

  onDateChange(): void {
    this.formData.date = this.selectedDate;
  }

  filterLocations(): void {
    if (this.locationSearch.length > 0) {
      this.filteredLocations = this.locations.filter(
        (location: ILocation) =>
          location.name.toLowerCase().includes(this.locationSearch.toLowerCase())
      );
    } else {
      this.filteredLocations = [];
    }
  }

  chooseLocation(id: number): void {
    const location: ILocation | undefined = this.locations.find(
      (l: ILocation) => l.id === id
    );
    if (location) {
      this.formData.locationId = id;
      this.locationSearch = location.name;
      this.filteredLocations = [];
    }
  }

  onSearchSubmit(form: NgForm): void {}

  setCurrentTask(task: 'counter' | 'dateTime'): void {
    this.currentTask = task;
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
