import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUser } from '../interfaces';
import { UserFormData, UserFormControls } from '../interfaces'; // или отдельный файл

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {

  @Output() createUser = new EventEmitter<IUser>();
  userForm!: FormGroup<UserFormControls>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group<UserFormControls>({
      name: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      username: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      email: this.fb.control('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ]),
      phone: this.fb.control('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(25),
      ]),
      website: this.fb.control('', [Validators.maxLength(100)]),
      address: this.fb.group({
        city: this.fb.control('', [Validators.maxLength(50)]),
        street: this.fb.control('', [Validators.maxLength(100)]),
        suite: this.fb.control('', [Validators.maxLength(50)]),
        zipcode: this.fb.control('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ]),
      geo: this.fb.group({
          lat: this.fb.control('', [Validators.required]),
          lng: this.fb.control('', [Validators.required]),
        }),
      }),
      company: this.fb.group({
        name: this.fb.control('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        catchPhrase: this.fb.control('', [Validators.maxLength(200)]),
        bs: this.fb.control('', [Validators.maxLength(100)]),
      }),
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    const formValue = this.userForm.value as UserFormData;
    const userData: IUser= {
      name: formValue.name ?? '',
      username: (formValue.username ?? '').trim() || 'Неизвестно',
      email: formValue.email ?? '',
      phone: formValue.phone ?? '',
      website: (formValue.website ?? '').trim() || 'Неизвестно',
      address: {
        city: (formValue.address?.city ?? '').trim() || 'Неизвестно',
        street: (formValue.address?.street ?? '').trim() || 'Неизвестно',
        suite: (formValue.address?.suite ?? '').trim() || 'Неизвестно',
        zipcode: formValue.address?.zipcode ?? '',
        geo: {
          lat: formValue.address?.geo?.lat ?? '',
          lng: formValue.address?.geo?.lng ?? '',
        },
      },
      company: {
        name: formValue.company?.name ?? '',
        catchPhrase: (formValue.company?.catchPhrase ?? '').trim() || 'Неизвестно',
        bs: (formValue.company?.bs ?? '').trim() || 'Неизвестно',
      },
    };

    this.createUser.emit(userData);
  }
}