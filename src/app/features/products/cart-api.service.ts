import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICart } from './interfaces/ICart';
import { ICartAddPayload } from './interfaces/ICartAddPayload';
import { ICartUpdatePayload } from './interfaces/ICartUpdatePayload';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = 'https://dummyjson.com';

  getCart(cartId: number): Observable<ICart> {
    return this.http.get<ICart>(`${ this.baseUrl }/carts/${ cartId }`);
  }

  addCart(payload: ICartAddPayload): Observable<ICart> {
    return this.http.post<ICart>(`${ this.baseUrl }/carts/add`, payload);
  }

  updateCart(cartId: number, payload: ICartUpdatePayload): Observable<ICart> {
    return this.http.put<ICart>(`${ this.baseUrl }/carts/${ cartId }`, payload);
  }

  deleteCart(cartId: number): Observable<ICart> {
    return this.http.delete<ICart>(`${ this.baseUrl }/carts/${ cartId }`);
  }

}