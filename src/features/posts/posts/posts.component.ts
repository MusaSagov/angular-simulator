import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostApiService } from '../post-api.service';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { AsyncPipe } from '@angular/common';
import { IPost } from '../interfaces/IPost';
import { ToastModule } from 'primeng/toast';
import { LoaderService } from '../../../service/loader.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [TableModule, SkeletonModule, ContextMenuModule, AsyncPipe, RouterLink, ToastModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [DialogService, MessageService]
})
export class PostsComponent implements OnInit {

  private readonly loaderService = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly postService = inject(PostApiService);
  private readonly messageService = inject(MessageService);
  private postsSubject: BehaviorSubject<IPost[]> = new BehaviorSubject<IPost[]>([]);
  posts$: Observable<IPost[]> = this.postsSubject.asObservable();

  isLoading = true;
  pageSize = 10;
  firstNumber = 0;
  totalRecords = 0;
  selectedPost: IPost | null = null;

  menuItems: MenuItem[] = [
    { label: 'Просмотр', command: () => this.onView() },
    { label: 'Редактировать', command: () => this.onEdit() },
    { label: 'Удалить', command: () => this.onDelete() }
  ];

  ngOnInit(): void {
    this.loadPosts(this.pageSize, this.firstNumber);
  }

  loadPosts(limit: number, skip: number): void {
    this.loaderService.showLoader();

    this.postService.getPosts(limit, skip)
      .pipe(
        tap((response) => {
          this.postsSubject.next(response.posts);
          this.totalRecords = response.total;
          }),
          finalize(() => this.loaderService.hideLoader())
      )
      .subscribe({
        error: () => {
          this.loaderService.hideLoader();
        }
      });
  }

  onPageChange(event: any): void {
    this.firstNumber = event.first;
    this.pageSize = event.rows;
    this.loadPosts(event.rows, event.first);
  }

  openDetail(id: number): void {
    this.router.navigate([`/posts/${id}`]);
  }

  viewPost(post: IPost): void {
    this.router.navigate(['/posts', post.id]);
  }

  onView(): void {
    if (!this.selectedPost) return;
    this.router.navigate(['/posts', this.selectedPost.id]);
  }


  onEdit(): void {
    if (this.selectedPost === null) return;
    const ref: DynamicDialogRef | null = this.dialogService.open(PostEditDialogComponent, {
      header: 'Post Edit',
      width: '50vw',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: this.selectedPost,
      draggable: false
    });

    if (ref) {
      ref.onClose.subscribe(() => {
        this.loadPosts(this.pageSize, this.firstNumber);
      });
    }
  }

  onDelete(): void {
    if (!this.selectedPost) return;
    const idToDelete = this.selectedPost.id;
    this.loaderService.showLoader();

    this.postService.deletePost(idToDelete)
      .pipe(
        tap(() => {
          const posts: IPost[] = this.postsSubject.getValue();
          const updatedPosts: IPost[] = posts.filter(p => p.id !== idToDelete);
          this.postsSubject.next(updatedPosts);
          this.totalRecords = Math.max(0, this.totalRecords - 1);
          this.selectedPost = null;

          this.messageService.add({ 
            severity: 'success', 
            summary: 'Успех', 
            detail: 'Пост удалён' 
          });
        }),
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe({
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Ошибка', 
            detail: 'Не удалось удалить пост' 
          });
          this.loaderService.hideLoader();
        }
      });
  }

  onRowSelect(event: any): void {
    this.selectedPost = event.data;
  }

}