import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostApiService } from '../post-api.service';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AsyncPipe } from '@angular/common';
import { IPost } from '../interfaces/IPost';
import { LoaderService } from '../../../service/loader.service';
import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [TableModule, SkeletonModule, ContextMenuModule, AsyncPipe, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [DialogService],
})
export class PostsComponent implements OnInit {

  loaderService: LoaderService = inject(LoaderService);
  router: Router = inject(Router);
  dialogService: DialogService = inject(DialogService);
  postService: PostApiService = inject(PostApiService);
  toastService: ToastService = inject(ToastService);
  postsSubject: BehaviorSubject<IPost[]> = new BehaviorSubject<IPost[]>([]);
  posts$: Observable<IPost[]> = this.postsSubject.asObservable();
  
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
          this.toastService.showError('Не удалось загрузить посты');
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

  onView(): void {
    if (!this.selectedPost) return;
    this.openDetail(this.selectedPost.id);
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

          this.toastService.showSuccess('Пост удалён');
          }),
       finalize(() => this.loaderService.hideLoader())
      )
      .subscribe({
        error: (err) => {
          this.toastService.showError('Не удалось удалить пост');
        }
      });
  }

  onRowSelect(event: any): void {
    this.selectedPost = event.data;
  }

}