import { Injectable, inject, signal, computed, Signal, WritableSignal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ProductApiService, ProductSortField, SortOrder } from './product-api.service';
import { IProductsQuery } from '../products/interfaces/IProductsQuery';
import { IProductResponse } from '../products/interfaces/IProductResponse';
import { IProduct } from '../products/interfaces/IProduct';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  
  private api: ProductApiService = inject(ProductApiService);

  search: WritableSignal<string> = signal('');
  searchQuery$: Observable<string> = toObservable(this.search).pipe(debounceTime(300));

  selectedCategory: WritableSignal<string | null> = signal<string | null>(null);
  page: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);
  sortField: WritableSignal<ProductSortField> = signal<ProductSortField>('title');
  sortOrder: WritableSignal<SortOrder> = signal<SortOrder>('asc');

  skip: Signal<number> = computed(() => (this.page() - 1) * this.pageSize());

  query: Signal<IProductsQuery> = computed<IProductsQuery>(() => ({
    limit: this.pageSize(),
    skip: this.skip(),
    category: this.selectedCategory() ?? undefined,
    sortBy: this.sortField(),
    order: this.sortOrder(),
  }));

  private responseSignal: Signal<IProductResponse> = toSignal(
    combineLatest([
      toObservable(this.query),
      this.searchQuery$.pipe(startWith('')),
    ]).pipe(
      switchMap(([q, search]: [IProductsQuery, string]) => {
        const queryWithSearch: IProductsQuery = {
          ...q,
          q: search || undefined,
        };
        return this.api.getProducts(queryWithSearch);
      }),
      startWith({ products: [], total: 0, skip: 0, limit: 0 } as IProductResponse),
    ),
    {
      initialValue: {
        products: [],
        total: 0,
        skip: 0,
        limit: 0,
      } as IProductResponse,
    },
  );

  products: Signal<IProduct[]> = computed(() => this.responseSignal().products);
  total: Signal<number> = computed(() => this.responseSignal().total);
  categories: Signal<string[]> = toSignal(this.api.getCategories(), { initialValue: [] as string[] });

}