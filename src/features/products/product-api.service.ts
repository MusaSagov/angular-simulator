import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from './interfaces/IProduct';
import { IProductResponse } from './interfaces/IProductResponse';
import { IProductsQuery } from './interfaces/IProductsQuery';

export type ProductSortField = 'title' | 'price' | 'rating' | 'stock';
export type SortOrder = 'asc' | 'desc';

@Injectable({ providedIn: 'root' })
export class ProductApiService {

  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = 'https://dummyjson.com';

  getProducts(q: IProductsQuery): Observable<IProductResponse> {
    let params = new HttpParams()
      .set('limit', q.limit)
      .set('skip', q.skip);

    if (q.q) params = params.set('q', q.q);
    if (q.category) params = params.set('category', q.category);
    if (q.sortBy) params = params.set('sortBy', q.sortBy);
    if (q.order) params = params.set('order', q.order);

    const path: "/products/search" | "/products" = q.q ? '/products/search' : '/products';
    return this.http.get<IProductResponse>(`${this.baseUrl}${path}`, { params });
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/products/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/products/categories`);
  }

}