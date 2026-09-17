import { ChangeDetectionStrategy, Component, inject, Signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../products.service';
import { CartService } from '../cart.service';
import { IProduct } from '../interfaces/IProduct';
import { ProductSortField, SortOrder } from '../product-api.service';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IField } from '../interfaces/IFields';
import { IOrders } from '../interfaces/IOrders';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, PaginatorModule, SelectModule, InputTextModule, SkeletonModule, ButtonModule, FormsModule, CurrencyPipe, RouterLink],
})
export class ProductsComponent {

  private productsService: ProductsService = inject(ProductsService);
  private cart: CartService = inject(CartService);

  products: Signal<IProduct[]> = this.productsService.products;
  total: Signal<number> = this.productsService.total;
  categories: Signal<string[]> = this.productsService.categories;

  sortFields: IField[] = [
    { label: 'Название', value: 'title' },
    { label: 'Цена', value: 'price' },
    { label: 'Рейтинг', value: 'rating' },
    { label: 'Наличие', value: 'stock' },
  ];

  sortOrders: IOrders[] = [
    { label: 'По возрастанию', value: 'asc' },
    { label: 'По убыванию', value: 'desc' },
  ];

  pageSizes: number[] = [10, 20, 30];

  search: WritableSignal<string> = this.productsService.search;
  selectedCategory: WritableSignal<string | null> = this.productsService.selectedCategory;
  page: WritableSignal<number> = this.productsService.page;
  pageSize: WritableSignal<number> = this.productsService.pageSize;
  sortField: WritableSignal<ProductSortField> = this.productsService.sortField;
  sortOrder: WritableSignal<SortOrder> = this.productsService.sortOrder;

  changePage(event: any): void {
    this.productsService.page.set(event.page + 1);
  }

  changePageSize(size: number): void {
    this.productsService.pageSize.set(size);
    this.productsService.page.set(1);
  }

  selectCategory(cat: string | null): void {
    this.productsService.selectedCategory.set(cat);
    this.productsService.page.set(1);
  }

  onSearchChange(value: string): void {
    this.productsService.search.set(value);
    this.productsService.page.set(1);
  }

  onSortFieldChange(value: ProductSortField): void {
    this.productsService.sortField.set(value);
    this.productsService.page.set(1);
  }

  onSortOrderChange(value: SortOrder): void {
    this.productsService.sortOrder.set(value);
    this.productsService.page.set(1);
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