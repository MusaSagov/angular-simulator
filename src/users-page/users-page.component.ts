import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { IUser } from '../interfaces';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-users-page',
  imports: [AsyncPipe],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  userService: UserService = inject(UserService);
  users$: Observable<IUser[]>;

  constructor() {
    this.users$ = this.userService.getUsers();
  }

  ngOnInit(): void {
    this.userService.loadUsers();
  }
}
