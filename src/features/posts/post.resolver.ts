// src/features/posts/post.resolver.ts
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PostApiService } from './post-api.service';
import { IPost } from './interfaces/IPost';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostResolver implements Resolve<IPost | null> {
  
  constructor(private api: PostApiService, private router: Router) {}

  resolve(snapshot: ActivatedRouteSnapshot): Observable<IPost | null> {
    const idParam = snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (!id) {
      this.router.navigate(['/posts']);
      return of(null);
    }

    return this.api.getPost(id).pipe(
      catchError(() => {
        this.router.navigate(['/posts']);
        return of(null);
      })
    );
  }

}