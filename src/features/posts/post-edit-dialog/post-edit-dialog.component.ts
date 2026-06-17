import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PostApiService } from '../post-api.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IPost } from '../interfaces/IPost';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../service/toast.service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-post-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './post-edit-dialog.component.html'
})
export class PostEditDialogComponent implements OnInit {

  config: DynamicDialogConfig = inject(DynamicDialogConfig);
  ref: DynamicDialogRef = inject(DynamicDialogRef);
  fb: FormBuilder = inject(FormBuilder);
  postApi: PostApiService = inject(PostApiService);
  messageService: ToastService = inject(ToastService);

  loading: boolean = false;

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    tags: [''],
    views: [0, Validators.min(0)]
  });

  ngOnInit(): void {
    const post: IPost = this.config.data as IPost;

    this.form.patchValue({
      title: post.title,
      tags: post.tags.join(', '),
      views: post.views ?? 0
    });
  }

  close(): void {
    this.ref.close();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    
    const title: string = this.form.value.title!;
    const tagsRaw: string = this.form.value.tags as string;
    const views: number | null = this.form.value.views ?? 0;

    this.postApi.updatePost(this.config.data.id, {
      title,
      tags: (tagsRaw || '').split(',').map(t => t.trim()).filter(Boolean),
      views
    })
      .pipe(
        tap(() => this.messageService.showSuccess('Пост успешно обновлён')),
        tap(() => this.ref.close()),
        catchError(() => {
          this.messageService.showError('Не удалось обновить пост');
          return of();
        })
      ).subscribe();
  }

}