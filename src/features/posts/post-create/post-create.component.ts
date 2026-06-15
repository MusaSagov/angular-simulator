import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostApiService } from '../post-api.service';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { IPost } from '../interfaces/IPost';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent implements OnInit {

  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private postApi: PostApiService, public router: Router, private messageService: MessageService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const newPost: IPost = {
      id: 0,
      title: this.form.value.title,
      body: this.form.value.content,
      tags: this.form.value.tags.split(',').map((t: string) => t.trim()),
      author: this.form.value.author,
      views: 0,
      createdAt: new Date().toISOString(),
      userId: 1
    };
    this.postApi.createPost(newPost).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/posts']);
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Пост успешно создан'
        });
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось создать пост'
        });
      }
    });
  }

}