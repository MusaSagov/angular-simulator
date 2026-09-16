import { Component, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductApiService } from '../product-api.service';
import { IProduct } from '../interfaces/IProduct';
import { CartService } from '../cart.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CardModule, ButtonModule, RouterLink, CurrencyPipe],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private api: ProductApiService = inject(ProductApiService);
  cart: CartService = inject(CartService);

  product: Signal<IProduct | null> = toSignal(
    this.route.params.pipe(
      switchMap(p => this.api.getProductById(Number(p['id'])))
    ),
    { initialValue: null }
  );

  addToCart() {
    const p: IProduct | null = this.product();
    if (!p) return;

    this.cart.addItem({
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail,
      quantity: 1,
      price: p.price,
    });
  }

}