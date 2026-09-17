import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CartService } from '../cart.service';
import { ICartItem } from '../interfaces/ICartItem';
import { TableModule } from 'primeng/table';
import { InputNumber } from 'primeng/inputnumber';
import { Card } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [TableModule, InputNumber, Card, CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {

  cart: CartService = inject(CartService);

}