import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PostApiService } from '../post-api.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IPost } from '../interfaces/IPost';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-post-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './post-edit-dialog.component.html',
  providers: [MessageService]
})
export class PostEditDialogComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly fb = inject(FormBuilder);
  private readonly postApi = inject(PostApiService);
  private readonly messageService = inject(MessageService);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    tags: [''],
    views: [0, Validators.min(0)]
  });

  loading = false;

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

    this.loading = true;

    const title: string = this.form.value.title!;
    const tagsRaw: string = this.form.value.tags as string;
    const views: number | null = this.form.value.views ?? 0;

    this.postApi.updatePost(this.config.data.id, {
      title,
      tags: (tagsRaw || '').split(',').map(t => t.trim()).filter(Boolean),
      views
    }).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Пост успешно обновлён' });
        this.ref.close();
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить пост' });
      }
    });
  }
  
}