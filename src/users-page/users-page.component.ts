import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { IUser } from '../interfaces';
import { map, Observable, tap } from 'rxjs';
import { UserService } from '../service/user.service';
import { AsyncPipe } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { UsersFilterComponent } from '../users-filter/users-filter.component';

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
  filterQuery: string | null = '';
  filteredUsers$: Observable<IUser[]>= this.users$.pipe(
    map(users => {
      const query: string = (this.filterQuery ?? '').trim();
      if (!query) return users;
      return users.filter(user =>
        user.name && user.name.toLowerCase().includes(query.toLowerCase())
      );
    })
  );
  
  ngOnInit(): void {
    this.userService.loadUsers()
      .pipe(
        tap((users: IUser[]) => this.userService.setUsers(users))
      )
      .subscribe();
  }

  onFilterChange(query: string | null): void {
    this.filterQuery = query;
  }

  onDeleteUser(user: IUser): void {
    this.userService.deleteUser(user);
  }

  onUserCreated(user: IUser): void {
    const users: IUser[] = this.userService.getUsers();
    const userWithId: IUser = { id: Date.now(), ...user };
    this.userService.setUsers([...users, userWithId]);
  }

  refreshUsers(): void {
    this.userService.refreshUsers()
    .subscribe(users => this.userService.setUsers(users));
  }

}
