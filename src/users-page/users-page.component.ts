import { Component, inject } from '@angular/core';
import { IUser } from '../interfaces';
import { BehaviorSubject, combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { UserService } from '../service/user.service';
import { AsyncPipe } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { UsersFilterComponent } from '../users-filter/users-filter.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [AsyncPipe, UserCardComponent, CreateUserComponent, UsersFilterComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  
  userService: UserService = inject(UserService);
  users$: Observable<IUser[]> = this.userService.users$;

  filterQuerySubject = new BehaviorSubject<string>('');
  filteredUsers$: Observable<IUser[]> = combineLatest([
    this.users$,
    this.filterQuerySubject.asObservable().pipe(
      startWith('')
    )
    ]).pipe(
      map(([users, query]: [IUser[], string]): IUser[] => {
      const trimmedQuery: string = (query ?? '').trim();
      if (!trimmedQuery) return users;
      return users.filter(user =>
      user.name && user.name.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
    })
  );
  
  ngOnInit(): void {
    this.userService.loadUsers().pipe(
      tap(users => {
        this.userService.setUsers(users);
      }),  
    ).subscribe();
  }

  onDeleteUser(user: IUser): void {
    this.userService.deleteUser(user);
  }

  onCreateUser(user: IUser): void {
    this.userService.addUser(user);
  }

  onFilterChange(query: string): void {
    this.filterQuerySubject.next(query);
  }

}
