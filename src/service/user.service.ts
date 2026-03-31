import { inject, Injectable } from "@angular/core";
import { LoaderService } from "./loader.service";
import { ToastService } from "./toast.service";
import { UserApiService } from "./user-api.service";
import { BehaviorSubject, catchError, delay, finalize, Observable, of, tap } from "rxjs";
import { IUser } from "../interfaces";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  loaderService: LoaderService = inject(LoaderService);
  toastService: ToastService = inject(ToastService);
  userApi: UserApiService = inject(UserApiService);

  private userSubject: BehaviorSubject<IUser[]>= new BehaviorSubject<IUser[]>([]);

  setUsers(users: IUser[]): void {
    this.userSubject.next(users);
  }

  getUsers(): Observable<IUser[]> {
    return this.userSubject.asObservable();
  }

  loadUsers(): void {
    this.loaderService.showLoader();
    this.userApi.getUsers()
    .pipe(
      delay(2000),
      tap((users: IUser[]) => this.setUsers(users)),
      catchError((error): Observable<IUser[]> => {
        this.toastService.showError('Не удалось загрузить пользователей');
        return of([]);
      }),
      finalize(() => this.loaderService.hideLoader()),
    ).subscribe();
  }
}