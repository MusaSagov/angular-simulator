import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DoCheck, inject } from '@angular/core';

@Component({
  selector: 'app-default',
  imports: [],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultComponent implements DoCheck {

  private http: HttpClient = inject(HttpClient);

  count: number = 0;

  ngDoCheck(): void {
    console.log('Change Detection');
  }

  onClick(): void {
    this.count = 6;
  }

  onTimeout(): void {
    setTimeout(() => {
      this.count = 9;
    }, 2000);
  }

  onPromise(): void {
    Promise.resolve().then(() => {
      this.count = 17;
    });
  }

  onHttp(): void {
    this.http.get('https://api.github.com/users/angular').subscribe(() => {
      this.count = 26;
    });
  }

  onInterval(): void {
    setInterval(() => {
      this.count++;
    }, 2000);
  }

  onCombo(): void {
    this.count = 100;

    Promise.resolve().then(() => {
      this.count = 200;
    });

    setTimeout(() => {
      this.count = 300;
    }, 2000);
  }

}


// 1.
//Интерфейс  не обновляется автоматически- нужно нажимать .

// 2.
// Сколько раз выполнился ngDoCheck()?Click-2, Timeout-2, Promise-2 раза, HTTP-3 раза, Interval - 1,Combo -2 раза и после каждого нажатия стоит до бесконечности просто так посекундно вызывется

// 3.
// Понадобилось ли использовать ChangeDetectorRef? Нет, ChangeDetectorRef не понадобился.При стратегии Default Angular сам запускает Change Detection после событий ..

// 4.
// Что именно, по вашему мнению, стало причиной запуска Change Detection?Причина во всех случаях одна и та же: асинхронное событие, которое выполняется внутри Angular Zone.
