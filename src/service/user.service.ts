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

  private usersSubject: BehaviorSubject<IUser[]>= new BehaviorSubject<IUser[]>([]);
  users$: Observable<IUser[]> =this.usersSubject.asObservable();

  setUsers(users: IUser[]): void {
    console.log('setUsers:', users);
    this.usersSubject.next(users);
    this.localStorage.saveData('users', users);
  }

  getUsers(): IUser[] {
    return this.usersSubject.getValue();
  }

  addUser(user: IUser): void {
    const users: IUser[] = this.getUsers();
    const { id, ...rest} = user;
    const userWithId: IUser = { id: Date.now(), ...rest };
    this.setUsers([...users, userWithId]);
  }

   deleteUser(user: IUser): void {
    const currentUsers: IUser[] = this.usersSubject.getValue().filter((u: IUser) => u.id !== user.id);
    this.usersSubject.next(currentUsers);
    this.setUsers(currentUsers);
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