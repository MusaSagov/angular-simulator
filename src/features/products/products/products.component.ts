import { Component, inject, signal, computed, ChangeDetectionStrategy, WritableSignal, Signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap, startWith, map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ProductApiService, ProductSortField, SortOrder } from '../product-api.service';
import { IProductResponse } from '../interfaces/IProductResponse';
import { IProduct } from '../interfaces/IProduct';
import { CartService } from '../cart.service';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProductsQuery } from '../interfaces/IProductsQuery';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardModule,
    PaginatorModule,
    SelectModule,
    InputTextModule,
    SkeletonModule,
    ButtonModule,
    FormsModule,
    CurrencyPipe,
    RouterLink
  ]
})
export class ProductsComponent {
  private api: ProductApiService = inject(ProductApiService);
  cart: CartService = inject(CartService);

  search: WritableSignal<string> = signal('');
  searchQuery$: Observable<string> = toObservable(this.search).pipe(debounceTime(300));

  selectedCategory: WritableSignal<string | null> = signal<string | null>(null);
  page: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);
  sortField: WritableSignal<ProductSortField> = signal<ProductSortField>('title');
  sortOrder: WritableSignal<SortOrder> = signal<SortOrder>('asc');

  skip: Signal<number>= computed(() => (this.page() - 1) * this.pageSize());

  query: Signal<IProductsQuery> = computed<IProductsQuery>(() => ({
    limit: this.pageSize(),
    skip: this.skip(),
    category: this.selectedCategory() ?? undefined,
    sortBy: this.sortField(),
    order: this.sortOrder(),
  }));
  
  private responseSignal = toSignal(
    combineLatest([
      toObservable(this.query),
      this.searchQuery$.pipe(startWith(''))
    ]).pipe(
      switchMap(([q, search]) => {
        const queryWithSearch: IProductsQuery = {
          ...q,
          q: search || undefined
        };
        return this.api.getProducts(queryWithSearch);
      }),
      startWith({ products: [], total: 0, skip: 0, limit: 0 } as IProductResponse)
    ),
    {
      initialValue: {
        products: [],
        total: 0,
        skip: 0,
        limit: 0
      } as IProductResponse
    }
  );

  products: Signal<IProduct[]> = computed(() => this.responseSignal().products);
  total: Signal<number> = computed(() => this.responseSignal().total);

  categories: Signal<string[]> = toSignal(this.api.getCategories(), { initialValue: [] as string[] });

  sortFields: { label: string; value: ProductSortField }[] = [
    { label: 'Название', value: 'title' },
    { label: 'Цена', value: 'price' },
    { label: 'Рейтинг', value: 'rating' },
    { label: 'Наличие', value: 'stock' }
  ];

  sortOrders: { label: string; value: SortOrder }[] = [
    { label: 'По возрастанию', value: 'asc' },
    { label: 'По убыванию', value: 'desc' }
  ];

  pageSizes: { label: string; value: number }[] = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '30', value: 30 }
  ];

  changePage(event: any) {
    this.page.set(event.page + 1);
  }

  changePageSize(size: number) {
    this.pageSize.set(size);
    this.page.set(1);
  }

  selectCategory(cat: string | null) {
    this.selectedCategory.set(cat);
    this.page.set(1);
  }

  onSearchChange(value: string) {
    this.search.set(value);
    this.page.set(1);
  }

  onSortFieldChange(value: ProductSortField) {
    this.sortField.set(value);
    this.page.set(1);
  }

  onSortOrderChange(value: SortOrder) {
    this.sortOrder.set(value);
    this.page.set(1);
  }

  addToCart(p: IProduct) {
    this.cart.addItem({
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail,
      quantity: 1,
      price: p.price
    });
  }

}