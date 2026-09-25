import { ChangeDetectionStrategy, Component, inject, Signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../products.service';
import { CartService } from '../cart.service';
import { IProduct } from '../interfaces/IProduct';
import { ProductSortField, SortOrder } from '../product-api.service';
import { CardModule } from 'primeng/card';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IField } from '../interfaces/IFields';
import { IOrder } from '../interfaces/IOrder';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule,TranslatePipe, PaginatorModule, SelectModule, InputTextModule, SkeletonModule, ButtonModule, FormsModule, CurrencyPipe, RouterLink],
})
export class ProductsComponent {

  private productsService: ProductsService = inject(ProductsService);
  private cart: CartService = inject(CartService);
  private readonly translateService: TranslateService = inject(TranslateService);

  products: Signal<IProduct[]> = this.productsService.products;
  total: Signal<number> = this.productsService.total;
  categories: Signal<string[]> = this.productsService.categories;

  sortFields: Signal<IField[]> = toSignal(
    this.translateService.stream([
      'PRODUCTS.SORT_FIELDS.TITLE',
      'PRODUCTS.SORT_FIELDS.PRICE',
      'PRODUCTS.SORT_FIELDS.RATING',
      'PRODUCTS.SORT_FIELDS.STOCK',
    ]).pipe(
      map((translations: Record<string, string>): IField[] => [
        {
          label: translations['PRODUCTS.SORT_FIELDS.TITLE'],
          value: 'title',
        },
        {
          label: translations['PRODUCTS.SORT_FIELDS.PRICE'],
          value: 'price',
        },
        {
          label: translations['PRODUCTS.SORT_FIELDS.RATING'],
          value: 'rating',
        },
        {
          label: translations['PRODUCTS.SORT_FIELDS.STOCK'],
          value: 'stock',
        },
      ]),
    ),
    {
      initialValue: [],
    },
  );

  sortOrders: Signal<IOrder[]> = toSignal(
    this.translateService.stream([
      'PRODUCTS.SORT_ORDERS.ASC',
      'PRODUCTS.SORT_ORDERS.DESC',
    ]).pipe(
      map((translations: Record<string, string>): IOrder[] => [
        {
          label: translations['PRODUCTS.SORT_ORDERS.ASC'],
          value: 'asc',
        },
        {
          label: translations['PRODUCTS.SORT_ORDERS.DESC'],
          value: 'desc',
        },
      ]),
    ),
    {
      initialValue: [],
    },
  );

  pageSizes: number[] = [10, 20, 30];

  search: WritableSignal<string> = this.productsService.search;
  selectedCategory: WritableSignal<string | null> = this.productsService.selectedCategory;
  page: WritableSignal<number> = this.productsService.page;
  pageSize: WritableSignal<number> = this.productsService.pageSize;
  sortField: WritableSignal<ProductSortField> = this.productsService.sortField;
  sortOrder: WritableSignal<SortOrder> = this.productsService.sortOrder;

  changePage(event: PaginatorState): void {
    this.productsService.page.set((event.page?? 0) + 1);
  }

  changePageSize(size: number): void {
    this.productsService.pageSize.set(size);
  }

  selectCategory(cat: string | null): void {
    this.productsService.selectedCategory.set(cat);
  }

  onSearchChange(value: string): void {
    this.productsService.search.set(value);
  }

  onSortFieldChange(value: ProductSortField): void {
    this.productsService.sortField.set(value);
  }

  onSortOrderChange(value: SortOrder): void {
    this.productsService.sortOrder.set(value);
  }

  addToCart(p: IProduct): void {
    this.cart.addItem({
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail,
      quantity: 1,
      price: p.price,
    });
  }

}