import { Component, input, inject, ChangeDetectionStrategy, InputSignal } from '@angular/core';
import { IProduct } from '../interfaces/IProduct';
import { CartService } from '../cart.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CardModule, ButtonModule, RouterLink, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {

  product: InputSignal<IProduct> = input.required<IProduct>();
  cart: CartService = inject(CartService);

  addToCart() {
    const p: IProduct = this.product();
    this.cart.addItem({
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail,
      quantity: 1,
      price: p.price
    });
  }

}