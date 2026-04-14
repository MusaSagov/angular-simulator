import { inject, Injectable } from "@angular/core";
import { LoaderService } from "./loader.service";
import { ToastService } from "./toast.service";
import { UserApiService } from "./user-api.service";
import { BehaviorSubject, catchError, delay, finalize, Observable, of, tap } from "rxjs";
import { IUser } from "../interfaces";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  loaderService: LoaderService = inject(LoaderService);
  toastService: ToastService = inject(ToastService);
  userApi: UserApiService = inject(UserApiService);
  localStorage: LocalStorageService = inject(LocalStorageService);

  private userSubject: BehaviorSubject<IUser[]>= new BehaviorSubject<IUser[]>([]);
  users$: Observable<IUser[]> =this.userSubject.asObservable();

  setUsers(users: IUser[]): void {
    this.userSubject.next(users);
    this.saveUsers(users);
  }

  getUsers(): IUser[] {
    return this.userSubject.getValue();
  }

   deleteUser(user: IUser): void {
    const currentUsers: IUser[] = this.userSubject.getValue().filter(u => u.id !== user.id);
    this.userSubject.next(currentUsers);
    this.saveUsers(currentUsers);
  }

  loadUsers(): Observable<IUser[]> {
    const cached: IUser[] | null = this.localStorage.loadData('users');
    if (cached) {
      this.setUsers(cached);
      return of(cached);
    }
    this.loaderService.showLoader();
    return this.userApi.getUsers()
    .pipe(
      catchError(() => {
        this.toastService.showError('Не удалось загрузить пользователей');
        return of([]);
      }),
      finalize(() => this.loaderService.hideLoader()),
    );
  }

  saveUsers(users: IUser[]): void {
    this.localStorage.saveData('users', users);
  }

  refreshUsers(): Observable<IUser[]> {
    this.userSubject.next([]);
    return this.userApi.getUsers()
      .pipe(
        tap(users => this.setUsers(users)),
        catchError(error => {
          this.toastService.showError('Не удалось обновить пользователей');
          return of([]);
        }),
        finalize(() => this.loaderService.hideLoader()),
      );
  }
}