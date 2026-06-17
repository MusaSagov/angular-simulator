import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostApiService } from '../post-api.service';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { IPost } from '../interfaces/IPost';
import { ToastService } from '../../../service/toast.service';
import { tap, catchError, of } from 'rxjs';
import { LoaderService } from '../../../service/loader.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder);
  postApi: PostApiService = inject(PostApiService);
  router: Router = inject(Router);
  toastService: ToastService = inject(ToastService);
  loaderService: LoaderService = inject(LoaderService);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    tags: ['', Validators.required],
    author: ['', Validators.required]
  });

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loaderService.showLoader();
    const newPost: IPost = {
      id: 0,
      title: this.form.value.title!,
      body: this.form.value.content!,
      tags: this.form.value.tags!.split(',').map((t: string) => t.trim()),
      author: this.form.value.author!,
      views: 0,
      createdAt: new Date().toISOString(),
      userId: 1
    };

    this.postApi.createPost(newPost)
      .pipe(
        tap(() => {
          this.toastService.showSuccess('Пост успешно создан');
          this.router.navigate(['/posts']);
          this.loaderService.hideLoader();
        }),
        catchError(() => {
          this.toastService.showError('Не удалось создать пост');
          this.loaderService.hideLoader();
          return of();
        })
      ).subscribe();
  }

}