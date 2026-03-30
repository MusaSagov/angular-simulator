import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root'})
export class LoaderService {
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisibleSubject.asObservable();
  
  on(): void {
    document.body.classList.add('loader-lock');
    this.isVisibleSubject.next(true);
  }

  off(): void {
    this.isVisibleSubject.next(false);
    document.body.classList.remove('loader-lock');
  }
} 