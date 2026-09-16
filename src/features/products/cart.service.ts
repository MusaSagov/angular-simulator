import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { ICart } from './interfaces/ICart';
import { ICartState } from './interfaces/ICartState';
import { ICartItemApi } from './interfaces/ICartItemApi';

const TAX_RATE = 0.2;

@Injectable({ providedIn: 'root' })
export class CartService {
  private state: WritableSignal<ICartState> = signal<ICartState>({ items: [] });

  items: Signal<ICartItemApi[]> = computed(() => this.state().items);
  itemsCount: Signal<number> = computed(() => this.state().items.reduce((sum, i) => sum + i.quantity, 0));
  subtotal: Signal<number> = computed(() => this.state().items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  tax: Signal<number> = computed(() => this.subtotal() * TAX_RATE);
  total: Signal<number> = computed(() => this.subtotal() + this.tax());

  addItem(item: Omit<ICart, 'price'> & { price: number }) {
    this.state.update(s => {
      const existing = s.items.find(i => i.id === item.id);
      if (existing) {
        return {
          ...s,
          items: s.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
        };
      }
      return { ...s, items: [...s.items, item] };
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.state.update(s => ({
      ...s,
      items: s.items.map(i => i.id === productId ? { ...i, quantity } : i)
    }));
  }

  removeItem(productId: number) {
    this.state.update(s => ({
      ...s,
      items: s.items.filter(i => i.id !== productId)
    }));
  }

  clear() {
    this.state.set({ items: [] });
  }

}