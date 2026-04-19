import { Component, inject } from '@angular/core';
import { IUser } from '../interfaces';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
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
  filterControl: FormControl<string | null> = new FormControl<string | null>('');
  filterChange$: Observable<string | null> = new Observable();
  filteredUsers$: Observable<IUser[]> = combineLatest([
    this.users$,
    this.filterControl.valueChanges.pipe(
      startWith('')
    )
    ]).pipe(
      map(([users, query]) => {
      console.log('Filtered users:', users);
      const trimmedQuery = (query ?? '').trim();
      if (!trimmedQuery) return users;
      return users.filter(user =>
      user.name && user.name.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
    })
  );
  
  ngOnInit(): void {
    const cached: IUser[] | null = this.userService.localStorage.loadData('users');
    if (cached) {
      this.userService.setUsers(cached);
      return;
    }
    this.userService.loadUsers()
      .pipe(
        tap((users: IUser[]) => this.userService.setUsers(users))
      )
      .subscribe();
  }

  onDeleteUser(user: IUser): void {
    this.userService.deleteUser(user);
  }

  onCreateUser(user: IUser): void {
    console.log('Created user:', user);
    this.userService.addUser(user);
  }

}
