import { Routes } from '@angular/router';
import { postResolver } from '../app/features/posts/post.resolver';
import { authGuard } from '../app/features/auth/auth.guard';
import { adminGuard } from '../app/features/auth/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../app/features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../app/features/home/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'users-page',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    loadComponent: () => import('../app/features/users/users-page/users-page.component').then(m => m.UsersPageComponent),
  },
  {
    path: 'posts',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('../app/features/posts/posts/posts.component').then(m => m.PostsComponent),
      },
      {
        path: 'create',
        loadComponent: () => import('../app/features/posts/post-create/post-create.component').then(m => m.PostCreateComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('../app/features/posts/post-detail/post-detail.component').then(m => m.PostDetailComponent),
        resolve: {
          post: postResolver,
        },
      },
    ],
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'cart',
    loadComponent: () => import('../app/features/products/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: '**',
    canActivate: [authGuard],
    loadComponent: () => import('./features/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent)
  }
];