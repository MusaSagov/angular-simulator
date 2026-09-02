import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-detector-ref',
  imports: [],
  templateUrl: './change-detector-ref.component.html',
  styleUrl: './change-detector-ref.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDetectorRefComponent implements DoCheck {

  count: number = 0;

  private http: HttpClient = inject(HttpClient);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngDoCheck(): void {
    console.log('ngDoCheck');
  }

  incMarkForCheck(): void {
    this.count++;
    this.cdr.markForCheck();
  }
  
  incDetectChanges(): void {
    this.count++;
    this.cdr.detectChanges();
  }

  detach(): void {
    this.cdr.detach();
  }

  incAfterDetach(): void {
    this.count++;
  }

  setTimeoutAfterDetach(): void {
    setTimeout(() => {
      this.count++;
    }, 2000);
  }

  setIntervalAfterDetach(): void {
    setInterval(() => {
      this.count++;
    }, 5000);
  }

  promiseAfterDetach(): void {
    Promise.resolve().then(() => {
      this.count++;
    });
  }

  reattach(): void {
    this.cdr.reattach();
  }

  incAfterReattach(): void {
    this.count++;
  }

  fetchUsers(): Observable<any> {
    return this.http.get('https://api.github.com/users/angular');
  }

}