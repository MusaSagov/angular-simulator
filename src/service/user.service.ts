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
  users$: Observable<IUser[]> =this.userSubject.asObservable();

  setUsers(users: IUser[]): void {
    this.userSubject.next(users);
  }

  getUsers(): IUser[] {
    return this.userSubject.getValue();
  }

  loadUsers(): Observable<IUser[]> {
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
  
}