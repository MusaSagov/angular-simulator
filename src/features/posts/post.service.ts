import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, map, Observable, of, ReplaySubject, switchMap, tap } from 'rxjs';
import { PostApiService } from './post-api.service';
import { IPost } from './interfaces/IPost';
import { ToastService } from '../../service/toast.service';
import { LoaderService } from '../../service/loader.service';
import { IPostResponse } from './interfaces/IPostResponse';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  private postApi: PostApiService = inject(PostApiService);
  private toastService: ToastService = inject(ToastService);
  private loaderService: LoaderService = inject(LoaderService);
  postsSubject: BehaviorSubject<IPost[]> = new BehaviorSubject<IPost[]>([]);
  posts$: Observable<IPost[]> = this.postsSubject.asObservable();
  totalRecords: number = 0;

  loadPosts(limit: number, skip: number): void {
    this.loaderService.showLoader();
    this.postApi.getPosts(limit, skip)
      .pipe(
        tap((response: IPostResponse) => {
          this.postsSubject.next(response.posts);
          this.totalRecords = response.total;
          }),
          finalize(() => this.loaderService.hideLoader()),
          catchError(() => {
            this.toastService.showError('Не удалось загрузить посты');
            return of();
          })
      )
      .subscribe()
  }

  deletePost(id: number): void {
    this.loaderService.showLoader();
    this.postApi.deletePost(id)
      .pipe(
        tap((deletedPost: IPost) => {
          const posts: IPost[] = this.postsSubject.getValue();
          const updatedPosts: IPost[] = posts.filter((p: IPost) => p.id !== id);
          this.postsSubject.next(updatedPosts);
          this.totalRecords = Math.max(0, this.totalRecords - 1);
        }),
        finalize(() => this.loaderService.hideLoader()),
        catchError(() => {
          this.loaderService.hideLoader();
          this.toastService.showError('Не удалось удалить пост');
          return of();
        })
      )
      .subscribe();
  }

}
