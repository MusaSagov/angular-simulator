import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableModule, TablePageEvent, TableRowSelectEvent } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AsyncPipe } from '@angular/common';
import { IPost } from '../interfaces/IPost';
import { PostService } from '../post.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [TableModule, SkeletonModule, ContextMenuModule, AsyncPipe, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  providers: [DialogService],
})
export class PostsComponent implements OnInit {

  private dialogService: DialogService = inject(DialogService);
  private postService: PostService = inject(PostService);
 
  router: Router = inject(Router);
  pageSize: number = 10;
  firstNumber: number = 0;
  selectedPost: IPost | null = null;

  posts$: Observable<IPost[]> = this.postService.posts$;
  totalRecords = this.postService.totalRecords;

  menuItems: MenuItem[] = [
    { label: 'Просмотр', command: () => this.onViewPost() },
    { label: 'Редактировать', command: () => this.onEdit() },
    { label: 'Удалить', command: () => this.onDelete() }
  ];

  ngOnInit(): void {
    this.postService.loadPosts(this.pageSize, this.firstNumber);
  }

  onPageChange(event: TablePageEvent): void {
    this.firstNumber = event.first;
    this.pageSize = event.rows;
    this.postService.loadPosts(event.rows, event.first);
  }

  openPost(post: IPost): void {
    this.router.navigate([`/posts/${ post.id }`]);
  }

  onViewPost(): void {
    if (!this.selectedPost) {
      return;
    }
    this.openPost(this.selectedPost);
  }

  onEdit(): void {
    if (!this.selectedPost) {
      return;
    }
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
  }

  onDelete(): void {
    if (!this.selectedPost) {
      return;
    }
    this.postService.deletePost(this.selectedPost.id)
  }

  onRowSelect(event: TableRowSelectEvent): void {
    this.selectedPost = event.data;
  }

}